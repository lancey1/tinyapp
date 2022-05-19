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
  const templateVars = {email:emailLookupbyID(cookieID)};
  if (!cookieID) {
    return res.redirect('/login');
  } 
  else {
    return res.render("urls_new",templateVars)};
});

app.get("/urls/:shortURL", (req, res) => {
  let cookieID = req.session.user_ID;
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL]["longURL"];
  const templateVars = { shortURL, longURL, email:emailLookupbyID(cookieID)};
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let cookieID = req.session.user_ID;
  let email = emailLookupbyID(cookieID);
  const templateVars = { urls: urlsForUser(cookieID), email};
  res.render("urls_index",templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  res.redirect(urlDatabase[shortURL]["longURL"]);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  let cookieID = req.session.user_ID;
  if (cookieID) {
    urlDatabase[shortURL] = {"longURL":req.body.longURL, "userID":cookieID};
    return res.redirect(`/urls/${shortURL}`);
  } 
  else {
    return res.send("You must be logged in to access this function");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  let cookieID = req.session.user_ID;
  if (cookieID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    return res.redirect(`/urls`);
  } 
  else {
    return res.send("URL does not belong to you! \nYou must be the owner to delete this URL. \n");
  }
});
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL]["longURL"] = req.body.longURL;
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  let cookieID = req.session.user_ID;
  let email = emailLookupbyID(cookieID);
  const templateVars = { urls: urlDatabase,email};
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let email =  req.body.email;
  let password = req.body.password;
  let id = idLookupByEmail(email);
  if (userLookupbyEmail(email) && passwordLookup(email,password)) {
    req.session.user_ID = users[id].id;
    return res.redirect('/urls');
  }
  if (userLookupbyEmail(email) || passwordLookup(email,password)) {
    return res.sendStatus(403).send(403);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/register", (req, res) => {
  let cookieID = req.session.user_ID;
  let email = emailLookupbyID(cookieID);
  const templateVars = { urls: urlDatabase,email};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  let randomUserID = generateRandomString();
  let emailInput =  req.body.email;
  let passwordInput = bcrypt.hashSync(req.body.password, 10);
  if (emailInput === "" || passwordInput === "" || userLookupbyEmail(emailInput)) {
    return res.send("Please enter valid details");
  } else {
    users[randomUserID] = {"id": randomUserID, "email": emailInput, "password":passwordInput};
    req.session.user_ID = users[randomUserID].id;
    return res.redirect('/urls');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////START OF FUNCTIONS //////////////////////////////////////////////////////////////////

const emailLookupbyID = function(userid) {
  let email = "";
  for (let ids in users) {
    if (userid === users[ids].id) {
      return email = users[ids].email;
    }
  } return undefined;
};
const generateRandomString = function() {
  let shortURL = '';
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; shortURL.length < 6; i++) {
    let tmpStr = possible.charAt(Math.floor(Math.random() * 54));
    shortURL += tmpStr;
  }
  return shortURL;
};

const userLookupbyEmail = function(email) {
  for (let elm in users) {
    if (email === users[elm].email) {
      return email;
    }
  } return false;
};

const passwordLookup = function(email,password) {
  let id = idLookupByEmail(email);
  if (userLookupbyEmail(email)) {
    if (bcrypt.compareSync(password, users[id].password)) {
      return true;
    } return false;
  }
};

const idLookupByEmail = function(email) {
  for (let ids in users) {
    if (email === users[ids].email) {
      return users[ids].id;
    }
  } return undefined;
};

const urlsForUser = function(id) {
  let urlToDisplay = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlToDisplay[url] = urlDatabase[url].longURL;
    }
  } return  urlToDisplay;
};
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////END OF FUNCTIONS //////////////////////////////////////////////////////////////////