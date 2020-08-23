  {
      "name": "week18",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
          "dev": "mocha -r esm --watch",
          "test": "mocha -r esm",
          "coverage": "nyc mocha -r esm",
          "report": "nyc mocha -r esm && http-server coverage"
      },
      "author": "",
      "license": "ISC",
      "esm": {
          "cjs": true
      },
      "dependencies": {
          "esm": "^3.2.25",
          "istanbul": "^0.4.5",
          "mocha": "^8.1.1",
          "nyc": "^15.1.0"
      },
      "devDependencies": {
          "http-server": "^0.12.3"
      }
  }