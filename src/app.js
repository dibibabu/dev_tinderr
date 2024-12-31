const express = require("express");

const app = express();

app.use('/',(req,res)=>{

    res.send("hello world")
})

app.listen(7777, () => {
  console.log("app is listening to port 7777");
});
