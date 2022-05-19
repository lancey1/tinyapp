const express = require("express");
const app = express();
const PORT = 8070; // default port 8080
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["secret key"]
}));

const {emailLookupbyID, generateRandomString, verifyEmail, passwordLookup, idLookupByEmail, urlsForUser} = require('./helperFunctions');

const urlDatabase = {
  b6UTxQ: {
    longURL:"https://www.tsn.ca",
    userID: "123456"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "123456"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "123456": {
    id: "123456",
    email: "aa@gmail.com",
    password: bcrypt.hashSync("12", 10)
  }
};

app.get("/urls/new", (req, res) => {
  let cookieID = req.session.user_ID;
  const templateVars = {email:emailLookupbyID(cookieID,users)};
  if (!cookieID) {
    return res.redirect('/login');
  } else {
    return res.render("urls_new",templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let cookieID = req.session.user_ID;
  let email = emailLookupbyID(cookieID, users);
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]["longURL"];
  const templateVars = {shortURL, longURL, email};
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let cookieID = req.session.user_ID;
  let email = emailLookupbyID(cookieID, users);
  const templateVars = { urls: urlsForUser(cookieID, urlDatabase), email};
  res.render("urls_index",templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  res.redirect(urlDatabase[shortURL]["longURL"]);
});

app.get("/login", (req, res) => {
  let cookieID = req.session.user_ID;
  let email = emailLookupbyID(cookieID, users);
  const templateVars = { urls: urlDatabase,email};
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  let cookieID = req.session.user_ID;
  let email = emailLookupbyID(cookieID, users);
  if (cookieID) {
    return res.redirect('/urls');
  }
  const templateVars = { urls: urlDatabase,email};
  res.render("urls_register", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  let cookieID = req.session.user_ID;
  if (cookieID) {
    urlDatabase[shortURL] = {"longURL":req.body.longURL, "userID":cookieID};
    return res.redirect(`/urls/${shortURL}`);
  } else {
    return res.send("You must be logged in to access this function");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  let cookieID = req.session.user_ID;
  if (cookieID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    return res.redirect(`/urls`);
  } else {
    return res.send("URL does not belong to you! \nYou must be the owner to delete this URL. \n");
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let cookieID = req.session.user_ID;
  if (cookieID === urlDatabase[shortURL].userID){
    urlDatabase[shortURL]["longURL"] = req.body.longURL;
    res.redirect('/urls')
  }else {
    return res.send("URL does not belong to you! \nYou must be the owner to edit this URL. \n");
  };
});

app.post("/login", (req, res) => {
  let {email, password} = req.body;
  let id = idLookupByEmail(email, users);
  if (passwordLookup(email,password,users)) {
    req.session.user_ID = users[id].id;
    return res.redirect('/urls');
  } else {
    return res.send("Please enter valid email and password");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  let randomUserID = generateRandomString();
  let emailInput =  req.body.email;
  let passwordInput = bcrypt.hashSync(req.body.password, 10);
  if (emailInput === "" || passwordInput === "") {
    return res.send("Please enter valid account details");
  }
  if (verifyEmail(emailInput, users)) {
    return res.send("Email account already registered! Try again with a different email")
  } else {
    users[randomUserID] = {"id": randomUserID, "email": emailInput, "password":passwordInput};
    req.session.user_ID = users[randomUserID].id;
    return res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});