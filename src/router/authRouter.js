const express =require("express")
const getJWT=require("../models/user")
const validatePassword=require("../models/user")
const User = require("../models/user");
const bcrypt =require("bcrypt")
const {validationSignupData} = require("../Validators/validation")

const authRouter = express.Router();


authRouter.post("/login", async (req,res)=>{
    const data = req.body;
    // const emailId=data.email;
    // const password=data.password
    const {email,password} =req.body;
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error("Invalid data") 
    }
    const isPasswordValid = await user.validatePassword(password)
    if(isPasswordValid){
        const token = await user.getJWT();
        res.cookie("token",token,{
            expires: new Date(Date.now()+8*24*60*60*1000)
        })
        res.send("Login in successfully as :"+ user.firstName)
    }
    else{
        throw new Error("Invalid data") 
    }
})

authRouter.post("/signup",async (req,res)=>{
    const data = req.body;
    validationSignupData(req)
    const {firstName,lastName,email,password,age,gender,skills,about}= req.body;
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        firstName,
        lastName,
        email,
        age,
        password:passwordHash,
        gender,
        about,
        skills,
    }
    ) 
    await user.save()
    res.send("User data is posted")
})

authRouter.post("/logout", async (req,res)=>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now())
        })
        res.send("logout successfull")
    }
    catch(err){
        res.status(400).send("Error :"+err.message);
    }
})


module.exports={authRouter}