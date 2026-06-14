const express = require('express');
const path = require('path');
const app = express()

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,"style.css")))

app.listen(7001,'0.0.0.0',()=>{
    console.log("css server running")
})