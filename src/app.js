const express = require("express");

const connectDB= require("./config/database")

const app = express();

app.use('/',(req,res)=>{

    res.send("hello world")
})
connectDB().then(()=>{

  console.log("database connected successfully");
  app.listen(7777, () => {
    console.log("app is listening to port 7777");
  });
  
}).catch(()=>{
  console.log("database connection error");
  
})

