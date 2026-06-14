const express = require('express');
const path = require('path');
const app = express()

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,"accommodations.html")))
app.get('/accommodation-details/:d',(req,res)=>{
    let destinationNumber = req.params?.d
    return res.sendFile(path.join(__dirname,`accommodation-details-${destinationNumber}.html`))
})

app.listen(7004,'0.0.0.0',()=>{
    console.log("accommodations server running")
})