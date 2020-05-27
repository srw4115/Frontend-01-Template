const net = require("net");
const parser = require("./parser.js");
const { render } = require("./render.js");

class Request {
  constructor(config) {
    const {
      host = "127.0.0.1",
      path = "/",
      port = 80,
      method = "GET",
      headers = {},
      body = {},
    } = config;

    this.host = host;
    this.path = path;
    this.port = port;
    this.method = method;
    this.body = body;
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      ...headers,
    };

    this.bodyText = "";

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join("\r\n")}\r\n\r\n${this.bodyText}`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();

      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }

      connection.on("data", (data) => {
        parser.receive(data.toString());

        if (parser.isFinished) {
          resolve(parser.response);
        }

        connection.end();
      });

      connection.on("error", (error) => {
        reject(error);
        connection.end();
      });
    });
  }
}

class Response {}

class ResponseParser {
  WAITTING_STATUS_LINE = 0;
  WAITTING_STATUS_LINE_END = 1;
  WAITTING_HEAD_NAME = 2;
  WAITTING_HEAD_SPACE = 3;
  WAITTING_HEAD_VALUE = 4;
  WAITTING_HEAD_LINE_END = 5;
  WAITTING_HEAD_BLOCK_END = 6;
  WAITTING_BODY = 7;

  statusLine = "";
  headers = {};
  headerName = "";
  headerValue = "";
  bodyParser = null;

  currentStatus = this.WAITTING_STATUS_LINE;

  get isFinished() {
    return this.bodyParser && this.bodyParser.finished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\S\s]+)/);

    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }

  receive = (string = "") => {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  };

  receiveChar = (char) => {
    const handlStr = {
      [this.WAITTING_STATUS_LINE]: () => {
        if (char === "\r") {
          this.currentStatus = this.WAITTING_HEAD_NAME;
        } else {
          this.statusLine += char;
        }
      },
      [this.WAITTING_HEAD_NAME]: () => {
        if (char === ":") {
          this.currentStatus = this.WAITTING_HEAD_SPACE;
        } else if (char === "\r") {
          this.currentStatus = this.WAITTING_HEAD_BLOCK_END;
          if (this.headers["Transfer-Encoding"] === "chunked") {
            this.bodyParser = new TrunkedBodyParser();
          }
        } else {
          this.headerName += char;
        }
      },
      [this.WAITTING_HEAD_SPACE]: () => {
        if (char === " ") {
          this.currentStatus = this.WAITTING_HEAD_VALUE;
        }
      },
      [this.WAITTING_HEAD_VALUE]: () => {
        if (char === "\r") {
          this.currentStatus = this.WAITTING_HEAD_LINE_END;

          this.headers[this.headerName] = this.headerValue;
          this.headerValue = "";
          this.headerName = "";
        } else {
          this.headerValue += char;
        }
      },
      [this.WAITTING_HEAD_LINE_END]: () => {
        if (char === "\n") {
          this.currentStatus = this.WAITTING_HEAD_NAME;
        }
      },
      [this.WAITTING_HEAD_BLOCK_END]: () => {
        if (char === "\n") {
          this.currentStatus = this.WAITTING_BODY;
        }
      },
      [this.WAITTING_BODY]: () => {
        this.bodyParser.receive(char);
      },
    };

    handlStr[this.currentStatus] && handlStr[this.currentStatus]();
  };
}

class TrunkedBodyParser {
  WAITTING_LENGTH = 0;
  WAITTING_LENGTH_LINE_END = 1;
  READING_TRUNK = 2;
  WAITTING_NEW_LINE = 3;
  WAITTING_NEW_LINE_END = 4;

  finished = false;
  length = 0;
  content = [];

  currentStatus = this.WAITTING_LENGTH;

  receive = (char) => {
    const handlStr = {
      [this.WAITTING_LENGTH]: () => {
        if (char === "\r") {
          if (this.length === 0) {
            this.finished = true;
          } else {
            this.currentStatus = this.WAITTING_LENGTH_LINE_END;
          }
        } else {
          this.length *= 16;
          this.length += parseInt(char, 16);
        }
      },
      [this.WAITTING_LENGTH_LINE_END]: () => {
        if (char === "\n") this.currentStatus = this.READING_TRUNK;
      },
      [this.READING_TRUNK]: () => {
        this.content.push(char);

        this.length--;

        if (this.length === 0) this.currentStatus = this.WAITTING_NEW_LINE;
      },
      [this.WAITTING_NEW_LINE]: () => {
        if (char === "\r") this.currentStatus = this.WAITTING_NEW_LINE_END;
      },
      [this.WAITTING_NEW_LINE_END]: () => {
        if (char === "\n") this.currentStatus = this.WAITTING_LENGTH;
      },
    };

    handlStr[this.currentStatus] && handlStr[this.currentStatus]();
  };
}

(async () => {
  const request = new Request({
    method: "POST",
    port: 9999,
    headers: {
      ["x-foo2"]: "custom",
    },
    body: {
      name: "111",
    },
  });

  const response = await request.send();

  //console.log(response);

  let dom = JSON.parse(parser.parseHTML(response.body));

  let img = render(dom);
  img.save("viewport.jpg");
})();

// const client = net.createConnection(
//   {
//     host: "127.0.0.1",
//     port: 9999,
//   },
//   () => {
//     // 'connect' listener
//     console.log("connected to server!");

//     client.write("POST / HTTP/1.1\r\n");
//     client.write("Content-Type: application/x-www-form-urlencoded\r\n");
//     client.write("Content-length: 11\r\n\r\n");
//     client.write("name=1");
//   }
// );

// client.on("data", (data) => {
//   console.log(data.toString());
//   client.end();
// });

// client.on("end", () => {
//   console.log("disconnected from server");
// });
