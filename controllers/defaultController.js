const { json } = require("express");
const User = require("../models/User");
const dotenv = require("dotenv").config();
const request = require("request");

const API_URL = process.env.API_URL || "";

const {
  accessDenied,
  notAuthorized,
  createFeedback,
  resourceNotFound,
  internalServerError,
} = require("../handlers/feedbackHandler");

const cookieName = "token";

const userHomePage = async (req, res, next) => {
  console.log("userHomePage");
  const auth = req.cookies[cookieName];
  const { quote, author } = req.body;

  request.post(
    {
      url: API_URL + "create-quote",
      headers: {
        Authorization: "Bearer " + auth, // token
      },
      form: {
        quote,
        author,
      },
    },
    function (error, response, body) {
      feedback = JSON.parse(body);
      if (response.statusCode != 200) {
        res.locals.feedback = feedback;
      }

      // console.log("get-quote respons: ", feedback);
      next();
    }
  );
};

const getUserHomePage = async (req, res) => {
  const { username } = req.body;

  let feedback = createFeedback(500, "Service unavailable", false);

  console.log("getUserHomePage for: ", username);

  // use token from previous middleware (login) if set, otherwise use cookie
  let token = res.locals.token ? res.locals.token : req.cookies[cookieName];

  request.post(
    {
      url: API_URL + "get-quote",
      headers: {
        Authorization: "Bearer " + token, // token
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        feedback = JSON.parse(body);

        // if feedback from previous middleware (add quote) add payload to feedback
        if (res.locals.feedback != undefined) {
          res.locals.feedback.payload = feedback.payload;
        }
      } else {
        console.error("getUserHomePage Error: ", error, body);
        feedback = createFeedback(
          500,
          "Service unavailable: " + error,
          false,
          []
        );
      }
      res.render("userHomePage", {
        title: "Quote generator - " + feedback?.username,
        data: res.locals.feedback ? res.locals.feedback : feedback,
      });
    }
  );
};

/**
 * Asynchronously handles the login request.
 *
 * @param {Object} req - The request object containing the username and password.
 * @param {Object} res - The response object used to send the response.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} A promise that resolves when the login is successful.
 */
const login = async (req, res, next) => {
  const { username, password } = req.body;

  console.log("login", username);

  let feedback = createFeedback(500, "Service unavailable", false);

  // call post loginuser on API
  request.post(
    {
      url: API_URL + "loginuser",
      form: {
        username,
        password,
      },
    },
    function (error, response, body) {
      feedback = JSON.parse(body);

      // call to loginuser successful
      if (!error && response.statusCode == 200) {
        // feedback = JSON.parse(body);
        token = feedback.payload.accessToken;

        // set cookie (accesstoken)
        res.cookie(cookieName, token);

        // set token for next middleware
        res.locals.token = token;

        next();
        return;
      } else {
        // call to loginuser failed
        console.log("ERROR: loginuser API call failed - ", error);
      }
      // todo
      res.render("login", {
        title: "Quote generator",
        data: feedback,
      });
    }
  );

  return;
};

const getUserQuotes = async (req, res) => {
  console.log("getUserQuotes");

  let feedback = createFeedback(500, "Service unavailable", false);
  const { username } = req.params;

  request(API_URL + username, function (error, response, body) {
    feedback = JSON.parse(body);

    res.render("userQuotes", {
      title: username + "'s quotes",
      data: feedback,
    });
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createuser = async (req, res, next) => {
  const { username, userpw, userpw2 } = req.body;

  let feedback = createFeedback(500, "Service unavailable", false);

  // Check repeated passwords
  if (userpw.localeCompare(userpw2) != 0) {
    feedback = createFeedback(400, "Illegal input: Unequal passwords", false);
    res.render("signup", {
      title: "Quote generator",
      data: feedback,
    });
  } else {
    request.post(
      {
        url: API_URL + "create-user",
        form: {
          username,
          password: userpw,
        },
      },
      function (error, response, body) {
        res.render("signup", {
          title: "Quote generator",
          data: JSON.parse(body),
        });
      }
    );
  }

  return;
};

/**
 * getCreateuser
 * @param {*} req
 * @param {*} res
 */
const getCreateuser = (req, res) => {
  let feedback = createFeedback(200, "", false);

  res.render("signup", {
    title: "Quote generator",
    data: feedback,
  });
};

/**
 * home
 * @param {*} req
 * @param {*} res
 */
const home = (req, res) => {
  console.log("home:", API_URL);
  let feedback = createFeedback(500, "Service unavailable", false);

  // get random quote
  request(API_URL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      feedback = JSON.parse(body);
      // console.log(feedback);
    }

    res.render("home", {
      title: "Quotes",
      data: feedback,
    });
  });
};

/**
 * getLogin
 * @param {*} get
 * @param {*} res
 * @param {*} next
 */
const getLogin = (get, res, next) => {
  console.log("getLogin");
  const feedback = createFeedback(200, "", true);
  res.render("login", {
    title: "Quote generator",
    data: feedback,
  });
};

module.exports = {
  createuser,
  getUserQuotes,
  login,
  home,
  getLogin,
  getCreateuser,
  createuser,
  getUserHomePage,
  userHomePage,
};
