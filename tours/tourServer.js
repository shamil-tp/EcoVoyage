const express = require('express');
const path = require('path');
const app = express()

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,"tours.html")))
app.get('/tour-details/:d',(req,res)=>{
    let destinationNumber = req.params?.d
    return res.sendFile(path.join(__dirname,`tour-details-${destinationNumber}.html`))
})

app.listen(7005,'0.0.0.0',()=>{
    console.log("tours server running")
})