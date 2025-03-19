const express = require('express')

const app = express()

app.get("/user",(req,res,next)=>{
    console.log("Handler 1")
    next()
    // res.send("Reponse 1")
},(req,res,next)=>{
    console.log("Handler 2")
    res.send("Reponse 2")
    next()
},(req,res,next)=>{
    console.log("Handler 3")
    res.send("Reponse 3")
})


// app.use("/",(req,res)=>{
//     res.send("Home Page")
// })

const PORT=5000;

app.listen(PORT,(req,res)=>{
    console.log(`Server created and running succesfully ${PORT}`)
})