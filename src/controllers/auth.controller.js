const userModel = require("../models/user.model")


/**
 * @name registerUserController
 * @route Post /api/auth/register
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req,res){

    const { username , email , password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message : "Please provide username, email and  password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [{ username }, {email}]
    })

    if(isUserAlreadyExists){

        /* isUserAleadyExists.username == username*/ 
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }
}

module.exports = {
    registerUserController
}