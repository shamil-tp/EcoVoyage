const express = require('express');
const path = require('path');
const app = express()

app.get('/about',(req,res)=>res.sendFile(path.join(__dirname,"about.html")))
app.get('/contact',(req,res)=>res.sendFile(path.join(__dirname,"contact.html")))
app.get('/faq',(req,res)=>res.sendFile(path.join(__dirname,"faq.html")))
app.get('/support',(req,res)=>res.sendFile(path.join(__dirname,"support.html")))

app.listen(7007,'0.0.0.0',()=>{
    console.log("pages server running")
})