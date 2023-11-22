const express = require("express");
const app = express();
const fs = require('fs')
const bcrypt = require('bcrypt')
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


const { users } = require("./model/index.js");
const { blogs } = require("./model/index.js");
test.config()

console.log(process.env.name);
//sidai yastoo hunxa require('dotenv').config --j garda ni hunxa


//say nodejs that we are using ejs, set everything 
app.set("view engine", "ejs")

app.get("/", async (req, res) => {
    const allBlogs = await blogs.findAll()
    // console.log(allBlogs)
    res.render("allBlogs", { blogs: allBlogs })
})
//get single Blog
app.get("/blogs/:id", async (req, res) => {
    const id = req.params.id
    // Alternative const {id} =req.params => object destructing
    // console.log(req.params.id);
    //aako id ko data blogs table bata fetch/find garnu paryoo
    // "SELECT * FROM BLOGS where id =" + req.params.id
    //* Another alternative const blog = await blogs.findByPk(id);
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    })

    // console.log(blog);
    res.render("singleBlogs", { blog });
})
//delete blog
app.get("/delete/:id", async (req, res) => {
    const id = req.params.id
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    })
    const fileName = blog[0].imageUrl;
    fs.unlink('./uploads/' + fileName, (err) => {
        if (err) {
            console.log('error ' + err)
        } else {
            console.log('delted')
        }
    })
    //aako id ko data (row) delete garni destroy method is used to delete
    await blogs.destroy({
        where: {
            id: id
        }
    })
    res.redirect('/');

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
    res.redirect("/")
})
app.use(express.static('./uploads/'))

app.get("/edit/:id", async (req, res) => {
    const id = req.params.id
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    })
    res.render("editBlog", { id: blog })
})
//edit form bata aako data handle
app.post("/edit/:id", upload.single('image'), async (req, res) => {
    const { title, subTitle, description } = req.body
    let fileName
    if (req.file) {
        fileName = req.file.filename
    }
    // console.log(req.body);
    const id = req.params.id
    //old data
    const oldData = await blogs.findAll({
        where: {
            id: id
        }
    })
    const oldFileName = oldData[0].imageUrl




    if (fileName) {
        //delete old if new file comes
        fs.unlink('/uploads/' + oldFileName, (err) => {
            if (err) {
                console.log('error occured', err);
            } else {
                console.log('Old file Deleted Successfully')
            }
        })
    }
    await blogs.update({
        title: title,
        subTitle: subTitle,
        description: description,
        imageUrl: fileName ? req.file.filename : oldFileName
    }, {
        where: {
            id: id
        }
    })

    res.send("edit success")

})

//Register User
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    // console.log(req.body)
    await users.create({
        email,
        password: bcrypt.hashSync(password, 8),
        username
    })
    res.send("user registered ")
})
const PORT = process.env.port
app.listen(PORT, () => {
    console.log("node js project has started at port " + PORT)
})