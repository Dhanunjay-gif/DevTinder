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

userRouter.get("/feed",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        let limit =parseInt(req.query.limit) || 10;
        limit= limit>50 ? 50 :limit;
        const skip=(page-1)*limit
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser},
                {toUserId:loggedInUser}
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((status)=>{
            hideUserFromFeed.add(status.fromUserId.toString())
            hideUserFromFeed.add(status.toUserId.toString())
        })
        const users = await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUserFromFeed)}},
                {_id:{$ne :loggedInUser._id}}
            ]
        }).select(USER_SAFEDATA).skip(skip).limit(limit)

        res.send(users)
    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

module.exports = userRouter;