// base64ify.js
// create a document for this file 
/*
 * @author Firstname Lastname
 * @version 1.0
 * @description base64ify
 * @license MIT
 * @link https://github.com/AliZolfaghar
 */
import fs from "fs";

const inputFile = process.argv[2];

if (!inputFile) {
  console.error("no file selected.");
  process.exit(1);
}

// read file content
const fileBuffer = fs.readFileSync(inputFile);

// convert to base64
const base64Content = fileBuffer.toString("base64");

// write to file
const outputFile = inputFile + ".b64";
fs.writeFileSync(outputFile, base64Content);

// write to csv
const csvFile = inputFile + ".import.csv";
const csvContent = `guid,base64\n,${base64Content}\n`;
fs.writeFileSync(csvFile, csvContent);

// write to json
const jsonFile = inputFile + ".import.json";
const jsonContent = `{"guid":"", "base64":"${base64Content}"}`;
fs.writeFileSync(jsonFile, jsonContent);

// show output
console.log("base64 file created:", outputFile);
console.log("csv file created:", csvFile);
console.log("json file created:", jsonFile);


