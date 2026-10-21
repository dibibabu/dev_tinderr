const mongoose=require("mongoose")

const connectDB=async ()=>{

    mongoose.connect("mongodb+srv://dibikannan_db_user:dibibabu@cluster0.vxybapp.mongodb.net/devtinder")
}
module.exports=connectDB
