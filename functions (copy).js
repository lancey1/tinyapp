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

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoBr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
   },
  i3BoCr: {
    longURL: "https://www.google.ca",
    userID: "aJ4W"
  }, 
  i3BoLr: {
    longURL: "https://www.google.ca",
    userID: "aJW"
  },    
  i3BoDr: {
    longURL: "https://www.google.ca",
    userID: "J48lW"
  }
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
// Finds an email in the database with the corosponding userid
const emailLookupbyID = function(userid,database) {
  let email = "";
  for (let ids in database) {
    if (userid === database[ids].id) {
      return email = database[ids].email;
    }
  } return undefined;
};
// Checks email if it exists in the database
const verifyEmail = function(email,database) {
  for (let elm in database) {
    if (email === database[elm].email) {
      return email;
    }
  } return false;
};
// Finds a user ID in the database with the corosponding email
const idLookupByEmail = function(email,database) {
  for (let ids in database) {
    if (email === database[ids].email) {
      return users[ids].id;
    }
  } return undefined;
};
// Finds all URLs in the database that belongs to the corosponding user ID
const urlsForUser = function(id,database) {
  let urlToDisplay = {};
  for (let url in database) {
    if (database[url].userID === id) {
      urlToDisplay[url] = database[url].longURL;
    }
  } return  urlToDisplay;
};
//
const passwordLookup = function(email,password) {
  let id = idLookupByEmail(email);
  if (verifyEmail(email)) {
    if (bcrypt.compareSync(password, users[id].password)) {
      return true;
    } return false;
  }
};

console.log(users)
console.log(idLookupByEmail("user2@example.com",users))
console.log(verifyEmail("user2@example.com",users))
console.log(passwordLookup("user2@example.com","dishwashaer-funk"),users)