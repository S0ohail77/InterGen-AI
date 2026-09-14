const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/**
 * @name registerUserController
 * @route Post /api/auth/register
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */


/**Register User Controller */
async function registerUserController(req, res) {

    try {

        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and  password"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isUserAlreadyExists) {

            /* isUserAleadyExists.username == username*/
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password : hash
        })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (err) {
        console.log("ERROR HAPPENED:", err)
    res.status(500).json({
        message: "Something went wrong"
        })
    }
}


/**
 * @name lloginUserController
 * @description login a user, expects email and password in the reques body
 * @access Public
 */
async function loginUserController(req, res) {

    try {

        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }        
        )

        res.cookie("token", token)

        res.status(201).json({
            message : "User loggedIn successfully",
            user:{
                id: user._id,
                username : user.username,
                email : user.email
            }
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController
}