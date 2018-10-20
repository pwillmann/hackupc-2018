"use strict";
const ResumeParser = require("cv-parser-multiformats");
const pdf2Text = require("pdf2text");
const fs = require("fs");

if (process.env.LAMBDA_TASK_ROOT) {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}/bin`;
} else {
  process.env.PATH = `${process.env.PATH}:./bin`;
}

module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
};

module.exports.parsecv = async (event, context) => {
  const file = JSON.parse(event.body);
  console.log(file.file);
  let rawBase64String = file.file.split(";base64,").pop();
  console.log(rawBase64String);
  fs.writeFileSync("/tmp/cv.pdf", rawBase64String, { encoding: "base64" });
  const pages = await pdf2Text("/tmp/cv.pdf");
  const text = pages.reduce((acc, val) => acc.concat(val), []).join(" ");
  fs.writeFileSync("/tmp/cv.text", text);

  const result = await ResumeParser.parseResumeFile("/tmp/cv.text", "/tmp/") // input file, output dir
    .then(file => {
      console.log("Yay! " + file);

      console.log("\n *START* \n");
      var content = fs.readFileSync("/tmp/cv.txt.json");
      console.log("Output Content : \n" + content);
      var jsonContent = JSON.parse(content);
      console.log("Name:", jsonContent.name);
      console.log("Email:", jsonContent.email);
      console.log("\n *EXIT* \n");
      return jsonContent;
    })
    .catch(error => {
      console.error(error);
      return error;
    });
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    body: JSON.stringify({
      result
    })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
