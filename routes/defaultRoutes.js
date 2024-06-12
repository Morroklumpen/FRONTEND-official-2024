const router = require("express").Router();
const request = require("request");

const {
  getUserQuotes,
  getLogin,
  login,
  createuser,
  getCreateuser,
  home,
  getUserHomePage,
  userHomePage,
} = require("../controllers/defaultController");

// get home
router.get("/", home);
// get signup form
router.get("/sign-up", getCreateuser);
// post signup form
router.post("/sign-up", createuser);

// get login form
router.get("/sign-in", getLogin);
// post login form
router.post("/sign-in", login, getUserHomePage);
router.post("/home", userHomePage, getUserHomePage);

// cookie test
//
router.get("/:username", getUserQuotes);

module.exports = router;

// const cookieName = "token";
// router.get("/cookie", function (req, res) {
//   let minute = 60 * 1000;
//   res.cookie(cookieName, "myToken", { maxAge: minute });

//   res.render("cookieTest", {
//     title: "cookieTest",
//     message: "",
//   });
// });

// router.post("/cookie", function (req, res) {
//   console.log(cookieName, " Cookie: ", req.cookies[cookieName]);
//   return res.send("nice!");
// });
