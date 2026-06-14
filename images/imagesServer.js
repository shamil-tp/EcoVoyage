const express = require('express');
const path = require('path');
const app = express()

app.use(express.static(path.join(__dirname)))

app.listen(7008,'0.0.0.0',()=>{
    console.log("images server running")
})