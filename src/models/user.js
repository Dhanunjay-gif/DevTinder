const mongoose =require("mongoose")
const validator= require("validator")

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
    }
},{
    timestamps:true
}
)

module.exports = mongoose.model("user",userSchema) 