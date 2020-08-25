const http = require('http');
const fs = require('fs');
const archiver = require('archiver');

let packname = 'package.zip';

const options = {
  host: 'localhost',
  port: 8081,
  path: `/?filename=${packname}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

var archive = archiver('zip', {
  zlib: {level: 9},
});

archive.directory(`./package`, false);
archive.finalize();

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});

archive.pipe(req);

archive.on('end', () => {
  req.end();
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

