const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const app = express();

app.get('/',async(req,res)=>{
    return res.sendFile(path.join(__dirname,"index.html")) // let homePage = await fs.readFile(path.join(__dirname,"index.html"),'utf-8')  KEEP IN MIND THAT EXPRESS DOES NOT NEED THIS
     
})


app.listen(7000,'0.0.0.0',()=>{
    console.log("app is running on port 7000")
})