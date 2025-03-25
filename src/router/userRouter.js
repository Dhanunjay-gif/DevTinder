const express =require("express")
const {userAuth} =require("../middlewares/auth")
const {ConnectionRequest}=require("../models/connectionRequest")
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFEDATA = "firstName lastName age about photourl skills"

userRouter.get("/user/requests/recieved", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFEDATA);
        res.json({
            message:"Data fetched successfully",
            data:connectionRequest
        })
    }
    catch(err){
        console.log(err)
        res.status(400).send("Error :"+err.message);
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequestExist = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFEDATA).populate("toUserId",USER_SAFEDATA);
        const data= connectionRequestExist.map((row)=>{
            if(row.fromUserId._id.toString()===row.toUserId._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data})
    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

module.exports = userRouter;