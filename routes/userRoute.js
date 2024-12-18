const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/signup").post(authController.createUser); // http://localhost:3000/users/signup
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboardPage); //authmiddleware aracılığıyla kullanıcı yetki kontrolü yaptım
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword").put(authController.resetPassword);

module.exports = router;
