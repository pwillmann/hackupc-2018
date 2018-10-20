"use strict";
const ResumeParser = require("cv-parser-multiformats");
var fs = require("fs");

if (process.env.LAMBDA_TASK_ROOT) {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}/bin`;
} else {
  process.env.PATH = `./bin`;
}

module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.cv = async (event, context) => {
  const file = JSON.parse(event.body);
  console.log(file.file);
  let rawBase64String = file.file.split(";base64,").pop();
  console.log(rawBase64String);
  fs.writeFileSync("./cv/cv.pdf", rawBase64String, { encoding: "base64" });

  const result = await ResumeParser.parseResumeFile("./cv/cv.pdf", "./cv") // input file, output dir
    .then(file => {
      console.log("Yay! " + file);

      console.log("\n *START* \n");
      var content = fs.readFileSync("./cv/cv.pdf.json");
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
    body: JSON.stringify({
      result
    })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
