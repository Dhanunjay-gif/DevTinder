const express = require('express')

const app = express()

app.use("/test",(req,res)=>{
    res.send("Hi Dhanu")
})

app.use("/hello",(req,res)=>{
    res.send("Hello D Namste From darshboard")
})

const PORT=5000;

app.listen(PORT,(req,res)=>{
    console.log(`Server created and running succesfully ${PORT}`)
})