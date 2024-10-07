const express = require("express");
const { signUp, signIn, googleSignIn } = require("../controllers/authController");

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/google-signin", googleSignIn);

module.exports = router;
