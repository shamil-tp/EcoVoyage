const express = require('express');
const path = require('path');
const app = express()

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,"destination.html")))
app.get('/destination-details/:d',(req,res)=>{
    let destinationNumber = req.params?.d
    return res.sendFile(path.join(__dirname,`destination-details-${destinationNumber}.html`))
})

app.listen(7002,'0.0.0.0',()=>{
    console.log("destinations server running")
})