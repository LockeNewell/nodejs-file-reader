#!/usr/bin/env node

const yargs = require("yargs");
const path = require('node:path');
var fs = require('fs');


function writeObject(out, headers, properties) {
  let obj = {};
  headers.forEach((header) => {
    obj[ header ] = properties.shift();
  })
  out.write('\n' + JSON.stringify(obj, null, '\t'));

}

const options = yargs
  .usage("Usage: -f <filePath>")
  .option("f", { alias: "file", describe: "file to convert", type: "string", demandOption: true })
  .argv;

const filePath = options.file;
const baseFileName = path.basename(filePath, '.csv');
const newFilePath = baseFileName + '.json';

var readableStream = fs.createReadStream(filePath);
readableStream.setEncoding('utf8');
var writableStream = fs.createWriteStream(newFilePath);
let date_ob = new Date();
console.log(`start ${date_ob.getMinutes()} ${date_ob.getSeconds()}`);

writableStream.write('[');
let chunkCount = 1;
let headers = [];
lastLine = '';

readableStream.on('data', function (chunk) {
  chunkCount++;
  const lines = chunk.split(/\r?\n/)
  if (headers.length === 0) {
    headers = lines.shift().split(',');
  } else if (lastLine.length > 0) {
    firstLine = lines.shift();
    const joinedLine = lastLine + firstLine;
    const joinedProperties = joinedLine.split(',');
    if (joinedProperties.length === headers.length) {
      writeObject(writableStream, headers, joinedProperties);
      writableStream.write(',');
    }
  }
  while (lines.length > 1) {
    const line = lines.shift();
    const properties = line.split(',');
    writeObject(writableStream, headers, properties);
    writableStream.write(',');
  }
  lastLine = lines.shift();
});


readableStream.on('end', function () {
  if (lastLine.length > 0) {
    const properties = lastLine.split(',');
    writeObject(writableStream, headers, properties);
  }
  writableStream.write('\n]');
  let date_ob = new Date();
  console.log(`end ${date_ob.getMinutes()} ${date_ob.getSeconds()}`);
  console.log(`converted ${filePath} ${newFilePath}`);
  console.log(`chunkCount: ${chunkCount}`);
});

