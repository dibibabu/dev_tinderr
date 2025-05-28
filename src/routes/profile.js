const express=require("express")
const profileRouter=express.Router()
const { userAuth } = require("../middlewares/auth");
const validateEditProfileData=require("../utils/validator")
profileRouter.use("/view", userAuth,async (req, res) => {
  try {
    const user=req.user
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


profileRouter.use("/edit",userAuth,async(req,res)=>{
  try {
    

    if (!validateEditProfileData) {

      throw new error ("invalid body")
    }

    const user=req.user

    Object.keys(req.body).forEach((key)=>{
      user[key]=req.body[key]
    })
  
    res.send("user edited successfully");

    return true
  } catch (error) {
    res.status(400).send(error.message);
  }

})
module.exports=profileRouter