const {
  registration,
  login,
  updateProfile,
  googleAuthCallbackHandler,
  loginSuccess,
  logout,
  loginFailed,
} = require("../controllers/auth");
const handlePostValidationResult = require("../validation/handleValidationResult");
const {
  loginValidationRules,
  registerValidationRules,
} = require("../validation/rules/authValidationRules");
const passport = require("passport");
const router = require("express").Router();

// auth routes
router.post(
  "/register",
  registerValidationRules,
  handlePostValidationResult,
  registration
);
router.post("/login", loginValidationRules, handlePostValidationResult, login);

// google o_auth routes
router.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.OAUTH_SUCCESS_URL,
    failureRedirect: process.env.OAUTH_FAILURE_URL,
    // session: false // Disable session support
  })
);

//  gitbhub o_auth routes
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: process.env.OAUTH_SUCCESS_URL,
    failureRedirect: process.env.OAUTH_FAILURE_URL,
  })
);


// o_auth result routes
router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/logout", logout);

module.exports = router;
