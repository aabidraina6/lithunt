const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 5000
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')


// app.set('view engine' , 'ejs')

// require("dotenv").config();
dotenv.config({path:'./config.env'})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
 

//! database.js
require('./db/conn')

app.use(express.json())
app.use(require('./router/router'))

app.get('/',(req,res)=>{
    // console.log('Here')
    res.send('Hi')
    // res.render('index')
})



app.listen(port,()=>{
    console.log(`server  is running on port ${port}`)
})

// app.use('')


