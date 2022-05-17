const express = require("express");
const router = express.Router();
const { userRegister, userInfo, userLogin } = require("../controller/userController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/info", authenticate, userInfo);

module.exports = router;
