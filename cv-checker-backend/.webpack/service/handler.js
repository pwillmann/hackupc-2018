module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./handler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./handler.js":
/*!********************!*\
  !*** ./handler.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ResumeParser = __webpack_require__(/*! cv-parser-multiformats */ "cv-parser-multiformats");
const pdf2Text = __webpack_require__(/*! pdf2text */ "pdf2text");
const fs = __webpack_require__(/*! fs */ "fs");
const rimraf = __webpack_require__(/*! rimraf */ "rimraf");
const axios = __webpack_require__(/*! axios */ "axios");

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

  const file = JSON.parse(event.body);

  let rawBase64String = file.file.split(";base64,").pop();
  const FILE_NAME = `cv_${Date.now()}`;

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
      var content = fs.readFileSync(`${BASE_PATH}/${FILE_NAME}.txt.json`);
      var jsonContent = JSON.parse(content);
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
  let githubUser = undefined;
  if (githubName) {
    githubUser = await getGitHubUserByName(githubName);
  }
  const result = {
    ...resumeJson,
    github: githubUser
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

const GITHUB_SEARCH_API_BASE_URL = "https://api.github.com/search/users";
const GITHUB_USERS_API_BASE_URL = "https://api.github.com/users";
const GITHUB_IN_EMAIL = "in:email";
const GITHUB_IN_NAME = "in:fullname";

const getGitHubUsername = async (email, fullname) => {
  const usersByEmail = await axios.get(
    `${GITHUB_SEARCH_API_BASE_URL}?q=${email}+${GITHUB_IN_EMAIL}`
  );
  console.log(
    `GET:  ${GITHUB_SEARCH_API_BASE_URL}?q=${email}+${GITHUB_IN_EMAIL}`
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
    `${GITHUB_SEARCH_API_BASE_URL}?q=${emailName}+${GITHUB_IN_EMAIL}`
  );
  console.log(
    `GET:  ${GITHUB_SEARCH_API_BASE_URL}?q=${emailName}+${GITHUB_IN_NAME}`
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
    `${GITHUB_SEARCH_API_BASE_URL}?q=${fullNameImproved}+${GITHUB_IN_NAME}`
  );
  console.log(
    `GET:  ${GITHUB_SEARCH_API_BASE_URL}?q=${fullNameImproved}+${GITHUB_IN_NAME}`
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
    `${GITHUB_SEARCH_API_BASE_URL}?q=${lastNameImproved}+${GITHUB_IN_NAME}`
  );
  console.log(
    `GET:  ${GITHUB_SEARCH_API_BASE_URL}?q=${lastNameImproved}+${GITHUB_IN_NAME}`
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

const getGitHubUserByName = async name => {
  const userReq = await axios.get(`${GITHUB_USERS_API_BASE_URL}/${name}`);
  console.log(`GET:  ${GITHUB_USERS_API_BASE_URL}/${name}`);
  console.log(userReq.data);
  if (userReq.data) {
    const user = userReq.data;
    return {
      login: user.login,
      blog: user.blog,
      location: user.location,
      hireable: user.hireable
    };
  }
};


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "cv-parser-multiformats":
/*!*****************************************!*\
  !*** external "cv-parser-multiformats" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cv-parser-multiformats");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "pdf2text":
/*!***************************!*\
  !*** external "pdf2text" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("pdf2text");

/***/ }),

/***/ "rimraf":
/*!*************************!*\
  !*** external "rimraf" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rimraf");

/***/ })

/******/ });
//# sourceMappingURL=handler.js.map