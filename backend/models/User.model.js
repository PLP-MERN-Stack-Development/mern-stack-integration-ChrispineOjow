import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        unique:[true, "Username already exists"],
        trim:true,
        maxlength:30
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:[true, "The email entered already exists"],
        //Validation check of the email
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:[6, "Password should contain more than 6 characters"],
        select:false //Ensures password hash is never returned by default queries

    },
    role:{
        type:String,
        enum:["user","author","admin"],
        default:"user"
    },
    name:{
        type:String,
        trim:true
    },
    bio:{
        type:String,
        maxlength:500
    },
    avatar:{
        type:String,
        default: 'default-avatar.png',
        post:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Post"
            }
        ]
    }
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    //Hashing the password with cost of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();

})

export default mongoose.model("User",userSchema);
