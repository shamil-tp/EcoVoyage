const express = require('express');
const path = require('path');
const app = express()

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,"blog.html")))
app.get('/blog-post/:d',(req,res)=>{
    let destinationNumber = req.params?.d
    return res.sendFile(path.join(__dirname,`blog-post-${destinationNumber}.html`))
})

app.listen(7003,'0.0.0.0',()=>{
    console.log("blogs server running")
})