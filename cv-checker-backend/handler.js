"use strict";
const ResumeParser = require("cv-parser-multiformats");
const pdf2Text = require("pdf2text");
const fs = require("fs");
const rimraf = require("rimraf");
const axios = require("axios");

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

const BASE_PATH = "/tmp";

module.exports.parsecv = async (event, context) => {
  console.log("start parsing");
  console.log("event: ", event);
  const file = JSON.parse(event.body);
  console.log("file:", file.file);
  let rawBase64String = file.file.split(";base64,").pop();
  const FILE_NAME = `cv_${Date.now()}`;
  console.log("raw file:", rawBase64String);
  fs.writeFileSync(`${BASE_PATH}/${FILE_NAME}.pdf`, rawBase64String, {
    encoding: "base64"
  });

  const pages = await pdf2Text(`${BASE_PATH}/${FILE_NAME}.pdf`);
  const text = pages.reduce((acc, val) => acc.concat(val), []).join(" ");
  fs.writeFileSync(`${BASE_PATH}/${FILE_NAME}.txt`, text);

  const resumeJson = await ResumeParser.parseResumeFile(
    `${BASE_PATH}/${FILE_NAME}.txt`,
    `${BASE_PATH}`
  ) // input file, output dir
    .then(file => {
      console.log("Yay! " + file);

      console.log("\n *START* \n");
      var content = fs.readFileSync(`${BASE_PATH}/${FILE_NAME}.txt.json`);
      console.log("Output Content : \n" + content);
      var jsonContent = JSON.parse(content);
      console.log("Name:", jsonContent.name);
      console.log("Email:", jsonContent.email);
      console.log("\n *EXIT* \n");

      rimraf.sync(`${BASE_PATH}/`);
      return jsonContent;
    })
    .catch(error => {
      console.error(error);
      rimraf.sync(`${BASE_PATH}/`);
      return error;
    });

  const githubName = await getGitHubUsername(resumeJson.email, resumeJson.name);
  console.log("Found github user: ", githubName);
  const result = {
    ...resumeJson,
    github: githubName
  };
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
};

const GITHUB_USERS_API_BASE_URL = "https://api.github.com/search/users";
const GITHUB_IN_EMAIL = "in:email";
const GITHUB_IN_NAME = "in:fullname";

const getGitHubUsername = async (email, fullname) => {
  const usersByEmail = await axios.get(
    `${GITHUB_USERS_API_BASE_URL}?q=${email}+${GITHUB_IN_EMAIL}`
  );
  console.log(
    `GET:  ${GITHUB_USERS_API_BASE_URL}?q=${email}+${GITHUB_IN_EMAIL}`
  );
  console.log(usersByEmail.data);
  if (
    usersByEmail.data.items &&
    usersByEmail.data.items[0] &&
    usersByEmail.data.items[0].login
  ) {
    return usersByEmail.data.items[0].login;
  }

  const emailName = email
    .split("@")[0]
    .split(".")
    .join("+");

  const usersByEmailName = await axios.get(
    `${GITHUB_USERS_API_BASE_URL}?q=${emailName}+${GITHUB_IN_EMAIL}`
  );
  console.log(
    `GET:  ${GITHUB_USERS_API_BASE_URL}?q=${emailName}+${GITHUB_IN_NAME}`
  );
  console.log(usersByEmailName.data);
  if (
    usersByEmailName.data.items &&
    usersByEmailName.data.items[0] &&
    usersByEmailName.data.items[0].login
  ) {
    return usersByEmailName.data.items[0].login;
  }

  const fullNameImproved = fullname
    .split(".")
    .join("+")
    .split(" ")
    .join("+");
  const usersByFullName = await axios.get(
    `${GITHUB_USERS_API_BASE_URL}?q=${fullNameImproved}+${GITHUB_IN_NAME}`
  );
  console.log(
    `GET:  ${GITHUB_USERS_API_BASE_URL}?q=${fullNameImproved}+${GITHUB_IN_NAME}`
  );
  console.log(usersByFullName.data);
  if (
    usersByFullName.data.items &&
    usersByFullName.data.items[0] &&
    usersByFullName.data.items[0].login
  ) {
    return usersByFullName.data.items[0].login;
  }

  const lastNameImproved = fullname.split(" ")[1];
  const usersByLastName = await axios.get(
    `${GITHUB_USERS_API_BASE_URL}?q=${lastNameImproved}+${GITHUB_IN_NAME}`
  );
  console.log(
    `GET:  ${GITHUB_USERS_API_BASE_URL}?q=${lastNameImproved}+${GITHUB_IN_NAME}`
  );
  console.log(usersByLastName.data);

  if (
    usersByLastName.data.items &&
    usersByLastName.data.items[0] &&
    usersByLastName.data.items[0].login
  ) {
    return usersByLastName.data.items[0].login;
  }

  return "";
};
