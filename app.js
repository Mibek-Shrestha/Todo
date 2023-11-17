const express = require("express");
const app = express();
//telling node js to require and use .env

const test = require('dotenv')
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
const PORT = process.env.port
app.listen(PORT, () => {
    console.log("node js project has started at port " + PORT)
})