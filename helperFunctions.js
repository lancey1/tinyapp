const bcrypt = require('bcryptjs');

//Generates a random alphanumerical string from the possible characters
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
      return database[ids].id;
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
//First confirms that the email exists in the database. Secondly finds the User ID in the database so that it can be used to retrieve the Password from the database to be compared with the Hashed Password.
const passwordLookup = function(email,password,database) {
  if (verifyEmail(email,database)) {
    let id = idLookupByEmail(email,database);
    if (bcrypt.compareSync(password, database[id].password)) {
      return true;
    } return false;
  }
};
module.exports = {emailLookupbyID, generateRandomString, verifyEmail, passwordLookup, idLookupByEmail, urlsForUser};
