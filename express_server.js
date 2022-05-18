const express = require("express");
const app = express();
const PORT = 8050; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get("/urls/new", (req, res) => {
  let cookieid = req.cookies["user_id"]
  let email = userLookup(cookieid,users)
  const templateVars = {email};
  res.render("urls_new",templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let cookieid = req.cookies["user_id"]
  let email = userLookup(cookieid,users)
  let shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL],email};
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let cookieid = req.cookies["user_id"]
  let email = userLookup(cookieid,users)
  const templateVars = { urls: urlDatabase, email};
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = "http://"+req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  // let email = req.cookies[email];
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/register", (req, res) => {
  let cookieid = req.cookies["user_id"]
  let email = userLookup(cookieid,users)
  const templateVars = { urls: urlDatabase,email};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  randomUserID = generateRandomString()
  users[randomUserID] = {"id": randomUserID, "email": req.body.email, "password":req.body.password};
  res.cookie("user_id", users[randomUserID].id);
  // console.log(req.cookies["user_id"])
  // setTimeout(()=>console.log(users), 1000)
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//////////////////////////////////////////////////////////////////////////////////////////////////


const userLookup = function(userid,data) {
  let email = ""
  for (let ids in users) {
    if (userid === data[ids].id) {
      return email = data[ids].email
    } 
  } return email
} 
// console.log(userLookup("userRandomID",users));


const generateRandomString = function() {
  let shortURL = '';
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; shortURL.length < 6; i++) {
    let tmpStr = possible.charAt(Math.floor(Math.random() * 54));
    shortURL += tmpStr;
  }
  return shortURL;
};