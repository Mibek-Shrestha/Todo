const express = require("express");
const app = express();
//telling node js to require and use .env
require("./model/index.js")

//telling nodejs to accept the incoming data (parsing data)
// app.use(express.json()) react vue bata
app.use(express.urlencoded({ extended: true }))


const test = require('dotenv');
const { blogs } = require("./model/index.js");
test.config()

console.log(process.env.name);
//sidai yastoo hunxa require('dotenv').config --j garda ni hunxa


//say nodejs that we are using ejs, set everything 
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("allBlogs")
})

app.get("/addBlog", (req, res) => {
    res.render("addBlog")
})

//api for handling form data 
app.post("/addBlog", async (req, res) => {
    // console.log(req.body);
    await blogs.create({
        title: req.body.title,
        subTitle: req.body.subTitle,
        description: req.body.description
    })
    res.send("Blog Created Sucessfully")
})


const PORT = process.env.port
app.listen(PORT, () => {
    console.log("node js project has started at port " + PORT)
})