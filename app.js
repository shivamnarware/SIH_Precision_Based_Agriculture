const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");
const Comment = require("./models/comments");
const Reply = require("./models/reply");
const Fertilzer = require("./models/fertilizer");
const Irrigation = require("./models/irrigation");
const Area = require("./models/landarea");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/SIH", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//passport configuration
app.use(require("express-session")({
    secret: 'i am shivam an it is a key',
    resave: false,
    saveUninitialized: true,
}));

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//tell express to use passport
app.use(passport.initialize());
app.use(passport.session());

//using passport local mongoose and in user model hence User.serilaize is serialising the data
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.redirect("/home");
});

app.get("/home", function (req, res) {

    res.render("main/home", { currentUser: req.user });
});

//comment section 
app.get("/home/comments", function (req, res) {

    res.render("comments/comment");
});


//QUESTIONS 
app.get("/home/comments/questions", function (req, res) {
    Comment.find({}).populate("reply").exec(function (err, comment) {
        if (err) {
            res.redirect("back");
        }
        else {
            //   console.log(comment);
            res.render("comments/question", { comments: comment });
        }
    });
});
app.get("/home/comments/questions/new", isloggedIn, function (req, res) {
    res.render("comments/new");
});
app.post("/home/comments/questions", function (req, res) {
    Comment.create(req.body.comment, function (err, createcomment) {
        if (err) {
            res.redirect("back");
        }
        else {
            createcomment.author._id = req.user._id;
            createcomment.author.username = req.user.username;
            console.log(createcomment);
            createcomment.save();
            res.redirect("/home/comments/questions");
        }
    });
});

app.get("/home/comments/questions/reply/:replyid/new", isloggedIn, function (req, res) {
    Comment.findById(req.params.replyid, function (err, reply) {
        res.render("comments/reply", { reply: reply });
    });
});

app.post("/home/comments/questions/reply/:replyid", isloggedIn, function (req, res) {
    console.log("Reached1");
    Comment.findById(req.params.replyid, function (err, comment) {
        if (err) { res.redirect("back") }
        else {
            Reply.create(req.body.reply, function (err, createreply) {
                if (err) {
                    res.redirect("back");
                }
                else {
                    console.log(req.body.reply);
                    createreply.save();
                    comment.reply.push(createreply);
                    comment.save();
                    res.redirect("/home/comments/questions");
                }
            });
        }
    });

});


app.get("/home/fertilizer", function (req, res) {
    res.render("fertilizers/main");
});

app.get("/home/fertilizer/new", function (req, res) {
    res.render("fertilizers/form");
});

app.post("/home/fertilizer", function (req, res) {
    Fertilzer.create(req.body.fertilizer, function (err, createdfertilzer) {
        if (err) {
            res.redirect("back");
        }
        else {
            console.log(createdfertilzer);

        }
    });
});


app.get("/home/irrigation", function (req, res) {
    res.render("irrigation/main");
});

app.get("/home/irrigation/new", function (req, res) {
    res.render("irrigation/form");
});

app.post("/home/irrigation", function (req, res) {
    Irrigation.create(req.body.irrigation, function (err, createdirrigation) {
        if (err) { res.redirect("back"); }
        else {
            console.log(createdirrigation);
        }
    });
});


app.get("/home/area", function (req, res) {
    res.render("landarea/main");
});

app.get("/home/area/new", function (req, res) {
    res.render("landarea/form");
});

app.post("/home/area", function (req, res) {
    Area.create(req.body.area, function (err, createarea) {
        if (err) {
            res.redirect("back");
        }
        else {
            console.log(createarea);
        }
    });
});

app.get("/home/croptype", function (req, res) {
    res.render("croptype/main");
});

app.get("/home/croptype/new", function (req, res) {
    res.render("landarea/form");
});

//About
app.get("/home/about", function (req, res) {
    res.render("about/about");
});

//contact
app.get("/home/contact", function (req, res) {
    res.render("contact/contact");
});



// AUTHENTICATION ROUTES
//auth routes
//show up the sign up form
app.get("/register", function (req, res) {
    res.render("register");
});

//handling user sign up
app.post("/register", function (req, res) {
    req.body.username;
    req.body.password;
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        else {
            //log the user in,take care of session,store correct information,use serialise method
            passport.authenticate("local")(req, res, function () {
                res.redirect("/home");
            });
        }
    });
});

//login routes
//render login page
app.get("/login", function (req, res) {
    res.render("login");
});

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), function (req, res) {

});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});



function isloggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



app.listen(process.env.PORT, process.env.IP, function () {
    console.log("SERVER HAS STARTED");
});
