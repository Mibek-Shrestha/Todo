const express = require("express");
const app = express();
//telling node js to require and use .env
require("./model/index.js")

//requiring multerConfig
//* or yo garda ni vayooo
//* const multer = require("./middleware/multerConfig")
const { multer, storage } = require("./middleware/multerConfig.js")

const upload = multer({ storage: storage })


//telling nodejs to accept the incoming data (parsing data)
// app.use(express.json()) react vue bata //ct = application/json handle
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
app.post("/addBlog", upload.single('image'), async (req, res) => {
    // console.log(req.file);
    // return

    // const title = req.body.title
    // const subTitle = req.body.subTitle
    //destructing
    const { title, subTitle, description } = req.body
    await blogs.create({
        //key=value or title= title;
        title,
        subTitle,
        description,
        imageUrl: req.file.filename
    })
    res.send("Blog Created Sucessfully")
})


const PORT = process.env.port
app.listen(PORT, () => {
    console.log("node js project has started at port " + PORT)
})