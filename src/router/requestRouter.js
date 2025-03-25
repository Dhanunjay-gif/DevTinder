const express =require("express")
const {userAuth}=require("../middlewares/auth")
const {ConnectionRequest}=require("../models/connectionRequest")
const User = require("../models/user");

const requestRouter=express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res)=>{
    try{

        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId
        const status=req.params.status
        const allowedStatus = ["ignored","interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:`Invalid status type : ${status}`})
        }

        if(fromUserId.equals(toUserId)){
            return res.status(400).json({message:"You cant send request to yourself "})
        }

        const toUserExist = await User.findById(toUserId)
        if(!toUserExist){
            return res.status(400).json({message:"User not found"})
        }

        const existingConnectionrequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingConnectionrequest){
            return res.status(400).json({message:"connection request already exist"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data= await connectionRequest.save();
        res.json({message:req.user.firstName+ " is "+status+" in "+toUserExist.firstName})

    }
    catch(err){
        res.status(400).send("ERROR :"+err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus){
            return res.status(400).json({message:"status is not found"});
        }
        const connectionRequestExist = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!connectionRequestExist){
            return res.status(400).json({message:"connection request not found"});
        }
        connectionRequestExist.status=status;
        const data=await connectionRequestExist.save();
        res.json({message:"connection request "+status,data})
    } 
    catch(err){
        res.status(400).json({message:"ERROR :"+err.message})
    }
})
module.exports=requestRouter