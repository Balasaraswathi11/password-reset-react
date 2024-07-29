import mongoose from "mongoose";

 const userschema=({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type : String,
        required:true,
        unique:true
    }
,
password:{ type : String,
    required:true,
    unique:true},

    resetPasswordToken:{
        type:String,
        
    },
    resetPasswordExpires:{
        type:Date
    }
 })
 


const User=mongoose.model("User",userschema)
export default User