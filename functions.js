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



const emailLookupbyID = function(userid) {
  let email = ""
  for (let ids in users) {
    if (userid === users[ids].id) {
      return email = users[ids].email
    } 
  } return undefined
} 
// console.log(userLookupbyID("userRandomID",users));

const idLookupByEmail = function(email) {
  for (let ids in users) {
    if (email === users[ids].email) {
      return users[ids].id
    } 
  } return undefined
} 

const userLookupbyEmail = function(email){
  for (let elm in users) {
    if (email === users[elm].email) {
      return true
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

// console.log(users)
// console.log(idLookupByEmail("user2@example.com"))
// console.log(userLookupbyEmail("user2@example.com"))
// console.log(passwordLookup("user2@example.com","dishwashaer-funk"))


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

const urlsForUser = function(id) {
  urlToDisplay = {}
  for (url in urlDatabase){
    if (urlDatabase[url].userID === id){ 
      urlToDisplay[url] = urlDatabase[url].longURL
    }
  } return  urlToDisplay
}


const authenticateUser = function(id,url) {
  if (urlDatabase[url].userID === id){ 
    return true
  } else { 
      return false;
  }
}



console.log(authenticateUser("aJW","i3BoLr"))




// const authenticateUser = function(id) {
//   if (urlDatabase["i3BoBr"].userID === id){ 
//     return true
//   } else {
//     return  false
//   }
// }
// console.log(authenticateUser("aJ48lW"))

