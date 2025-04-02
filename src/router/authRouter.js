const express =require("express")
const getJWT=require("../models/user")
const validatePassword=require("../models/user")
const User = require("../models/user");
const bcrypt =require("bcrypt")
const {validationSignupData} = require("../Validators/validation")

const authRouter = express.Router();


authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = await user.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        });
        res.send(user);
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


authRouter.post("/signup",async (req,res)=>{
    try{
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
    res.json({message:"User data saved successfully",
        data:user
    })
}
catch(err){
    res.status(400).send("Error :"+err.message);
}
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


module.exports=authRouter;