const bcrypt = require('bcryptjs');
const { assert } = require('chai');
const {emailLookupbyID, generateRandomString, verifyEmail , idLookupByEmail, urlsForUser} = require('../helperFunctions');

const testUsers = {
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
};


describe('emailLookupbyID', function() {
  it('should return an email with valid ID, function()', function() {
    const userID = emailLookupbyID("userRandomID", testUsers)
    const expectedEmail = "user@example.com";
    assert.equal(userID, expectedEmail);
  });
});

describe('emailLookupbyID', function() {
  it('should return another users email with valid ID', function() {
    const userID = emailLookupbyID("user2RandomID", testUsers)
    const expectedEmail = "user2@example.com";
    assert.equal(userID, expectedEmail);
  });
});

describe('emailLookupbyID', function() {
  it('should undefined when passed an invalid user ID', function() {
    const userID = emailLookupbyID("nonExistentUserID", testUsers)
    const expectedEmail = undefined;
    assert.equal(userID, expectedEmail);
  });
});
