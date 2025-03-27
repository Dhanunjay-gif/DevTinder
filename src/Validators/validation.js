const validator = require("validator")

const validationSignupData = (req) =>{
    const {firstName,lastName,email,password} = req.body
    if(!firstName || !lastName){
        throw new Error("first and last name is not present")
    }
    else if(firstName.length<4 || firstName.length>50){
        throw new Error("firstName length should between 4 and 50 chars")
    }
    else if(!validator.isEmail(email)){
        throw new Error("emil is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("plz enter strong password")
    }
}

const validateEditProfileData = (req) =>{
    const allowedEditField= ["firstName","lastName","photourl","gender","age","skills","about"]
    const isEditAllowerd = Object.keys(req.body).every(field=>allowedEditField.includes(field))
    return isEditAllowerd
}

module.exports = {validationSignupData,validateEditProfileData}  