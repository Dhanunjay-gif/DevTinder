const express = require("express")
const {connectDB}=require("./config/database")
const User = require("./models/user");
const user = require("./models/user");
const {validationSignupData} = require("./Validators/validation")
const bcrypt= require("bcrypt")
const app =express()
const PORT =5000;

app.use(express.json())


app.post("/signup",async (req,res)=>{
    const data = req.body;
    validationSignupData(req)
    const {firstName,lastName,email,password,age,gender}= req.body;
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        firstName,
        lastName,
        email,
        age,
        password:passwordHash,
        gender,
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

const serverStart = async ()=>{
    await connectDB()
    app.listen(PORT,(req,res)=>{
        console.log(`Server created and running successfully ${PORT}`)
    })
}

serverStart()
