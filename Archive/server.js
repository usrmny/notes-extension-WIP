const express = require('express')
const app = express()
const path = require('path')

const dirPath = path.join(__dirname, "public")

app.get("/", (req,res) => {
    res.end();
})

app.use(express.static(dirPath))//to use static files in dirPath


app.listen(3000)














//app.set("view engine", "ejs")

//app.get('/', (req, res) => {
   // console.log("hello")
    //res.download("Downloads!!!")
    //console.log("hello")
    //res.status(500).json({message:"Error"})
   // res.render('miniNotes')
//})


//const userRouter = require('./routes/users')

// creaes routes for all files 
// that end with /users in 
// directory and applies whats in 
// users.js
//app.use('/users', userRouter)
