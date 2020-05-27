// const http = require("http");

// const server = http.createServer((req, res) => {
//   console.log("request recived");
//   console.log(req.headers);

//   let body = [];

//   req
//     .on("data", (chunk) => {
//       body.push(chunk);
//     })
//     .on("end", () => {
//       body = Buffer.concat(body).toString();

//       console.log(body);
//     });

//   res.setHeader("Content-type", "text/html");
//   res.setHeader("x-foo", "bar");
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("ok");
// });

// server.listen(9999);

const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-type", "text/html");
  res.setHeader("x-foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`<html maaa=a >
  <head>
    <style>
      body div #myImg{
        width: 100px;
        height: 100px;
        background-color: #ff5000;
      }

      body div img{
        width: 100%;
        background-color: #ff1111;
      }

      body .content{
        color: red;
      }

      body .test .content {
        width: 100px
      }

      div[class~="content"] {
        font-siez: 12px;
      }

      #container {
        width: 500px;
        height: 300px;
        display: flex;
        background-color: rgb(230,100,101);
      }

      #container .c1{
       width: 200px;
       height: 100px;
       background-color: rgb(255,255,255);
      }

      #container .c2{
        flex: 1;
        height: 100px;
        background-color: rgb(100,100,255);
       }
    </style>
  </head>
  <body>
    <div id="container">
      <div class="c1"/>
      <div class="c2"/>
    </div>
    <div class="content">222</div>
    <div id="test" class="test">
      <img id="myImg" />
      <img />
      <span class="content">1111</span>
    </div>
  </body>
</html>`);
});

server.listen(9999);
