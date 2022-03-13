//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const encrypt=require("mongoose-encryption");
const md5=require("md5");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true
});
//object created
const userSchema =new mongoose.Schema( {
  email: String,
  password: String
});
//Added comments11111
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:["password"] });

// console.log(process.env.API_KEY);

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
    }
  });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email:username},function(err,foundUser){
      if(err){
      res.send(err);
      }
      else{
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }
        }
      }
    })


});


app.listen(3000, function() {
  console.log("Server started Successfully.");
});
