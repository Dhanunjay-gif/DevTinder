const User= require("../models/user")
const jwt = require("jsonwebtoken")
const userAuth = async (req,res,next)=>{
    try{
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            throw new Error("Invlid token ")
        }
        const decodedObj = await jwt.verify(token,"DEV@Tinder")
        const {id} =decodedObj;
        const user = await User.findById(id)
        if(!user){
            throw new Error("User not found")
        }
        req.user=user;
        next();
    }
    catch(error){
        res.status(400).send("Something wend wrong "+error.message)
    }

}

module.exports={userAuth}