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
  console.log("hello");
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
};

module.exports.parsecv = async (event, context) => {
  console.log("start parsing");
  console.log("event: ", event);
  const file = JSON.parse(event.body);
  console.log("file:", file.file);
  let rawBase64String = file.file.split(";base64,").pop();
  console.log("raw file:", rawBase64String);
  fs.writeFileSync("/tmp/cv.pdf", rawBase64String, { encoding: "base64" });

  const pages = await pdf2Text("/tmp/cv.pdf");
  const text = pages.reduce((acc, val) => acc.concat(val), []).join(" ");
  fs.writeFileSync("/tmp/cv.txt", text);

  const result = await ResumeParser.parseResumeFile("/tmp/cv.txt", "/tmp/") // input file, output dir
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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
    },
    body: JSON.stringify({
      result
    })
  };

  //   this.header( 'Access-Control-Allow-Origin', options.allowOrigin );
  this.header("Access-Control-Allow-Credentials", options.allowCredentials);
  this.header(
    "Access-Control-Expose-Headers",
    headerListValue(options.exposeHeaders)
  );
  this.header("Access-Control-Max-Age", options.maxAge);
  this.header(
    "Access-Control-Allow-Headers",
    headerListValue(options.allowHeaders)
  );

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
