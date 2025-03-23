const express = require("express")
const {connectDB}=require("./config/database")
const User = require("./models/user");
// const user = require("./models/user");
const {validationSignupData} = require("./Validators/validation")
const bcrypt= require("bcrypt")
const cookieParser= require("cookie-parser")
const jwt = require("jsonwebtoken")

const app =express()
const PORT =5000;

app.use(express.json())
app.use(cookieParser())

app.get("/profile", async (req,res)=>{
    try{
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            throw new Error("Invlid token ")
        }
        const decodedMessage = await jwt.verify(token,"DEV@Tinder")
        const {id} =decodedMessage;
        const user = await User.findById(id)
        if(!user){
            throw new Error("User not found")
        }
        res.send(user)
        console.log("Logged in user is: "+user.firstName)
    }
    catch(error){
        res.status(400).send("Something wend wrong"+error.message)
    }
})

app.post("/signup",async (req,res)=>{
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

app.patch("/userData", async (req,res)=>{
    const data=req.body;
    const userEmail = req.body.email;
    const userId = req.body.id;
    try{
        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument:"after", 
            runValidators:true  
        })
        if(user.length===0){
            res.status(404).send("User not found")
            console.log("User not found")
        }
        else{
            console.log("user data ",user)
            res.send(user)
        }
    }
    catch(err){
        res.status(404).send("something went wrong")
    }
})


app.post("/login", async (req,res)=>{
    const data = req.body;
    // const emailId=data.email;
    // const password=data.password
    const {email,password} =req.body;
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error("Invalid data") 
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(isPasswordValid){
        const token = await jwt.sign({id:user.id},"DEV@Tinder",{
            expiresIn:"1d"
        })
        res.cookie("token",token)
        res.send("Login in successfull")
    }
    else{
        throw new Error("Invalid data")
    }
})

const serverStart = async ()=>{
    await connectDB()
    app.listen(PORT,(req,res)=>{
        console.log(`Server created and running successfully ${PORT}`)
    })
}


serverStart()
 