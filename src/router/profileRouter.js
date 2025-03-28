const express=require("express")
const {userAuth} =require("../middlewares/auth")
const {validateEditProfileData}=require("../Validators/validation")

const profileRouter=express.Router();

profileRouter.get("/profile/view",userAuth, async (req,res)=>{
   try{
    const user=req.user;
    if(!user){
        throw new Error("user not found")
    }
    res.json({message:`User profile is : ${user.firstName}`,
        data:user
    })
   }
   catch(error){
    res.status(400).send(error.message)
   }
   
})

profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalide data")
        }
        const user=req.user;
        Object.keys(req.body).forEach(key=>user[key]=req.body[key])
        await user.save()
        res.json({message:`${user.firstName}, your profile updated successfully`,
        data:user})
    }
    catch(err){
        res.status(400).send("Error :"+err.message)
    }
})


module.exports=profileRouter