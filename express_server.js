const express = require("express");
const app = express();
const PORT = 8070; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");


const urlDatabase = {
  b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
    }
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
  },
  "123456": {
    id: "123456", 
    email: "aa@gmail.com", 
    password: "12"
  }
}

app.get("/urls/new", (req, res) => {
  let cookieID = req.cookies["user_id"]
  let email = emailLookupbyID(cookieID)
  const templateVars = {email};
  if(!cookieID){  
    res.redirect('/login');
  }
  res.render("urls_new",templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let cookieID = req.cookies["user_id"]
  let email = emailLookupbyID(cookieID)
  let shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL:urlDatabase[shortURL]["longURL"],email};
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let cookieID = req.cookies["user_id"]
  let email = emailLookupbyID(cookieID)
  const templateVars = { urls: urlDatabase, email};
  res.render("urls_index",templateVars)
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]["longURL"]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  let cookieID = req.cookies["user_id"]
  if (cookieID) {
  urlDatabase[shortURL] = {"longURL":req.body.longURL, "userID":cookieID}
  res.redirect(`/urls/${shortURL}`);}
  else{
    res.send("You must be logged in to access this function")
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/edit", (req, res) => { ////////// something wrong here
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
});


app.get("/login", (req, res) => {
  let cookieID = req.cookies["user_id"]
  let email = emailLookupbyID(cookieID)
  const templateVars = { urls: urlDatabase,email};
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let email =  req.body.email
  let password = req.body.password
  let id = idLookupByEmail(email)
  if (userLookupbyEmail(email) && passwordLookup(email,password)){
    res.cookie("user_id", users[id].id);
    res.redirect('/urls')
  }
  if (userLookupbyEmail(email) || passwordLookup(email,password)) {
    res.sendStatus(403).send(403);
  } 
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
  let cookieID = req.cookies["user_id"]
  let email = emailLookupbyID(cookieID)
  const templateVars = { urls: urlDatabase,email};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  let randomUserID = generateRandomString()
  let emailInput =  req.body.email
  let passwordInput = req.body.password
  if (emailInput === "" || passwordInput === "" || userLookupbyEmail(emailInput)) {
    res.sendStatus(404).send(400);
  } 
  else {
    users[randomUserID] = {"id": randomUserID, "email": emailInput, "password":passwordInput};
    res.cookie("user_id", users[randomUserID].id);
    res.redirect('/urls');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////START OF FUNCTIONS //////////////////////////////////////////////////////////////////

const emailLookupbyID = function(userid) {
  let email = ""
  for (let ids in users) {
    if (userid === users[ids].id) {
      return email = users[ids].email
    } 
  } return undefined
} 
const generateRandomString = function() {
  let shortURL = '';
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; shortURL.length < 6; i++) {
    let tmpStr = possible.charAt(Math.floor(Math.random() * 54));
    shortURL += tmpStr;
  }
  return shortURL;
};

const userLookupbyEmail = function (email){
  for (let elm in users) {
    if (email === users[elm].email) {
      return email
    } 
  } return false
} 

const passwordLookup = function(email,password){
  let id = idLookupByEmail(email)
  if (userLookupbyEmail(email)) {
    if (users[id].password === password) {
      return true
    } return false
  } 
}

const idLookupByEmail = function(email) {
  for (let ids in users) {
    if (email === users[ids].email) {
      return users[ids].id
    } 
  } return undefined
} 

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////END OF FUNCTIONS //////////////////////////////////////////////////////////////////