const {Router} = require("express");
const authController = require("../controllers/auth.controller")

const authRouter = Router();

/**
 * @route Post /api/auth/register
 * @description Register a new user
 * @access Public
*/
authRouter.post("/register",)


module.exports = authRouter