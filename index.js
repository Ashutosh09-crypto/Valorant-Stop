const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const bodyParser = require("body-parser")
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const users = require("./models/user.js")
const requests = require("./models/request.js")
const { authCheck } = require("./middleware/auth");
const request = require("./models/request.js")



const port = process.env.PORT || 8000;


// Load config
require("dotenv").config({ path: "./config/config.env" });

// Passport Config
require("./config/passport")(passport);


const app = express();


connectDB();



// Sessions middleware
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_DATABASE_URI }),
    })
);

// Configure bodyParser
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
// set template view engine
app.set("views", "./templates");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/static"));
app.use("/images", express.static(__dirname + "static/images"));

app.use(function (req, res, next) {
    if (!req.user) {
        res.header(
            "Cache-Control",
            "private, no-cache, no-store, must-revalidate"
        );
        res.header("Expires", "-1");
        res.header("Pragma", "no-cache");
    }
    next();
});



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());



app.get("/", async (req, res) => {
    const msg = req.flash("message");
    const context = {
        authenticated: req.isAuthenticated(),
        message: msg
    }

    res.render("index", context);
    req.flash("message", "");
})

app.post('/request', async (req, res) => {
    const { name, email, gender, country, order } = req.body;

    const userExist = await requests.findOne({ "name": name });

    if (userExist) {
        req.flash("message", "Sorry, your previous request is still pending!");
    } else {
        var newReq = new requests({
            username: name,
            email: email,
            country: country,
            gender: gender,
            order: order
        });

        newReq.save(function (err) {
            if (err) {
                console.log(err.errors);
            }
        });

        req.flash("message", "Your request is submitted successfully!. We will reach you out soon!");
    }

    res.redirect('/');
})

app.get('/contact', async (req, res) => {
    res.render("contact");
})


app.get("*", function (req, res) {
    res.status(404).send("<h1> Not Found! </h1>")
})



app.listen(port, (err) => {
    if (err) throw err;
    console.log("Connection done!");
})
