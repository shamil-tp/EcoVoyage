const express = require('express');
const path = require('path');
const app = express()

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,"app.js")))

app.listen(7006,'0.0.0.0',()=>{
    console.log("js server running")
})