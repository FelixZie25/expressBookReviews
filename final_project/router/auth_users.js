const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check is username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 },
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Extract isbn parameter from request URL
  const isbn = req.params.isbn;
  let book = books[isbn]; // Retrieve book object associated with isbn

  if (book) {
    // Check if book exists
    let review = req.body.reviews;

    // Update review if provided in request body
    if (review) {
      book["reviews"] = review;
    }

    books[isbn] = book; // Update book details in 'books' object
    res.send("Book with isbn " + isbn + " updated.");
  } else {
    res.send("Unable to find book!");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    let review = req.body.reviews;

    if (review) {
      book["reviews"] = review;
    }

    books[isbn] = book;
    res.send("Book with isbn " + isbn + " deleted.");
  } else {
    res.send("Unable to find book!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
