const express = require("express");
const app = express();
const port = 8000;
const fs = require('fs');
const fsPromise = require('fs').promises;
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretKey = "!@#$%^&*"
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const multer = require("multer");
app.set('view engine', 'ejs');
const db = require(__dirname + "/models/db.js");
const userModel = require(__dirname + "/models/user.js");
const sendMail = require(__dirname + "/controller/sendMail.js");
const productModel = require(__dirname + "/models/products.js");
const bodyParser = require("body-parser");
// const multer = require("multer");
const upload = multer({ dest: 'public/uploads/' });
db.init()
    .then(function () {
        console.log("Database Connected");

        app.listen(port, () => {
            console.log("Server Started");
        })
    })
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})
app.use(bodyParser.json());
app.use(express.static("public/uploads"));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//     origin:[
//         "http://localhost:8000",
//     ],
//     credentials:true
// }))

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })

//   const upload = multer({ storage: storage })

app.get("/", async (req, res) => {
    const token = req.cookies.uid;
    if (token === undefined) {
        res.redirect("/login");
    }
    else {
        const decoded = jwt.verify(token, secretKey);
        const user = await userModel.findOne({ username: decoded.username });
        if (!user.is_verify) {
            res.send("Kindly Verify your account");
        }
        else {
            const productData = await productModel.find();
            let limit = 5;
            let prods = [];
            if (productData.length < 5) {
                limit = productData.length;
            }
            for (let i = 0; i < limit; i++) {
                prods.push(productData[i]);
            }
            if (user.role == 1) {
                res.render("adminHomepage.ejs", { name: user.username, array: prods });
            }
            else {
                res.render("homepage", { name: user.username, array: prods });
            }
        }
    }
})
app.post("/", async (req, res) => {
    //console.log(req.body.initial);
    let initial = req.body.initial;
    // const data = await readFile("products.json");
    const productData = await productModel.find();
    // let arr = JSON.parse(data);
    if (productData.length <= initial) {
        res.send(JSON.stringify("no"));
    }
    else {
        let array = [];
        for (let i = initial; i < initial + 5; i++) {
            array.push(productData[i]);
        }
        res.send(array);
    }
})
app.post("/popup", async (req, res) => {

    let productId = req.body.productId;
    const productData = await productModel.findOne({ _id: productId });
    // let productId = req.body.productId;
    // const productsData = await readFile("products.json");
    // const productDataArray = JSON.parse(productsData);
    // let result;
    // for (let i = 0; i < productDataArray.length; i++) {
    //     if (productDataArray[i].prodId === productId) {

    //         result = productDataArray[i];
    //     }
    // }
    // console.log(result);
    res.send(productData);
})
app.post("/logout", async (req, res) => {
    console.log(req.cookies);
    res.clearCookie('uid');
    res.send({ status: 200 });
})
app.get("/signup", (req, res) => {
    // console.log(__dirname);
    res.sendFile(__dirname + "/public/signup.html");
})
app.post("/signup", async (req, res) => {
    let userData = req.body;
    const newPassword = await hashPassword(req.body.password);
    userData.password = newPassword;
    const user = userData.username;
    try {
        const checkUserName = await userModel.findOne({ username: userData.username });
        console.log(checkUserName);
        if (checkUserName) {
            return res.send("Username Already Exists");
        }
        else {
            await userModel.create(userData);
            const token = jwt.sign(userData, secretKey);
            const verify = `http://localhost:8000/verify?uid=${token}`;
            sendMail.mail(verify, user);
            res.send("Link is sent to your E-mail");
        }

    }
    catch (err) {
        console.log(err);
    }
})
app.get("/verify", async (req, res) => {
    const token = req.query.uid;
    const decoded = jwt.verify(token, secretKey);


    const userName = await userModel.findOne({ username: decoded.username });
    if (userName) {
        await userModel.updateOne(
            { username: decoded.username },
            { $set: { is_verify: true } }
        )
    }

    res.redirect("/login");
})
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
})
app.post("/login", async (req, res) => {
    const userData = req.body;
    const data = await userModel.findOne({ username: userData.username });
    console.log(data);
    if (data) {
        const match = await bcrypt.compare(userData.password, data.password);
        if (match) {
            if (data.is_verify) {
                const token = jwt.sign(userData, secretKey);
                res.cookie("uid", token);
                return res.send({ status: 200 });
            }
            else {
                return res.send(JSON.stringify("Email not verified"));
            }
        }
        else {
            return res.send(JSON.stringify("Wrong Password"));
        }
    }
    else {
        return res.send(JSON.stringify("Wrong Email ID"));

    }
})
app.post("/forgotpassword", async (req, res) => {
    const enteredUsername = req.body.username;
    let data = await userModel.findOne({ username: enteredUsername });
    console.log(data);
    if (data) {
        if (data.is_verify) {
            const token = jwt.sign({ "username": data.username, "password": data.password, "is_verify": data.is_verify }, secretKey);
            const verify = `http://localhost:8000/changepassword?uid=${token}`;
            sendMail.mail(verify, data.username);
            res.send("link is send to e-mail");
        }
        else {
            res.send("Email not verified");
        }
    }
    else {
        res.send("Wrong Email");
    }

})
app.get("/changepassword", async (req, res) => {
    const token = req.query.uid;
    const decoded = jwt.verify(token, secretKey);
    const data = await userModel.findOne({ username: decoded.username });
    res.render("changePassword", { name: data.username });
})
app.post("/changePassword", async (req, res) => {
    let newpassword = await hashPassword(req.body.newPassword);
    await userModel.updateOne({ username: req.body.username }, { $set: { password: newpassword } });
    res.send({ status: 200 });
})
app.get("/addproducts", (req, res) => {
    res.sendFile(__dirname + "/public/admin_addProducts.html");
})
app.post("/addproducts", upload.single('productImage'), async (req, res) => {
    console.log(req.file);
    // let filePath = __dirname+`/public/uploads/${req.file.filename}`;
    let newProduct = { productName: req.body.productName, productDescription: req.body.productDescription, productPrice: req.body.productPrice, productQuantity: req.body.productQuantity, productImage: req.file.filename };
    await productModel.create(newProduct);
    res.send(JSON.stringify("Done"));
})

const hashPassword = (password) =>
    new Promise((resolve, reject) =>
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                reject(err);
            else
                resolve(hash);
        })
    )
const readFile = (path) =>
    new Promise((resolve, reject) =>
        fs.readFile(path, "utf-8", (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        })
    )

const writeFile = (path, data) =>
    new Promise((resolve, reject) =>
        fs.writeFile(path, data, (err) => {
            if (err) reject(err);
            else
                resolve();
        })
    )


