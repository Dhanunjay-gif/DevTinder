const mongoose =require("mongoose")
const validator= require("validator")
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Addres")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!(["Male","Female","Other"].includes(value))){
                throw new Error("Gender data not valid")
            }
        }
    },
    skills:{
        type:[String],
    },
    about:{
        type:String
    },
    photourl:{
        type:String,
        default:"https://www.shutterstock.com/shutterstock/photos/1760295569/display_1500/stock-vector-profile-picture-avatar-icon-vector-1760295569.jpg"
    }

},
{
    timestamps:true
}
)

userSchema.methods.getJWT= async function(){
    const user=this;
    const token = await jwt.sign({id:user.id},"DEV@Tinder",{
        expiresIn:"7d"
    })
    return token;
}

userSchema.methods.validatePassword= async function(passwordByReqUser){
    const user=this
    const passwordHash=user.password
    const isPasswordValid=await bcrypt.compare(passwordByReqUser,passwordHash)  // password means req password
    if(isPasswordValid){
        return isPasswordValid
    }
}

module.exports = mongoose.model("user",userSchema) 