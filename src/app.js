const express = require("express")
const {connectDB}=require("./config/database")
const User = require("./models/user");
const bcrypt= require("bcrypt")
const cookieParser= require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} =require("./middlewares/auth")
const authRouter=require("./router/authRouter")
const profileRouter =require("./router/profileRouter")
const requestRouter=require("./router/requestRouter")
const userRouter=require("./router/userRouter")
const cors=require('cors')

const app =express() 
app.use(cors({
    origin: "http://localhost:5173", // Change to your frontend port
    credentials: true,
}));

app.use(express.json()) 
app.use(cookieParser())
const PORT =5000;
   
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter); 
app.use("/", userRouter);

app.post("/sendConnectionRequest",userAuth, async (req,res)=>{
    try{
        const user =req.user;
        if(!user){
            throw new Error("user not found")
        }
        console.log(`${user.firstName} sent connection request`)
        res.send(`${user.firstName} sent connection request`) 
    }
    catch(error){
        res.status(400).send("something went wrong")
    }
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




const serverStart = async ()=>{
    await connectDB()
    app.listen(PORT,(req,res)=>{
        console.log(`Server created and running successfully ${PORT}`)
    })
}


serverStart()
 