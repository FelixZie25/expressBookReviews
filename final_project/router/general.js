const express = require("express");
const axios = require("axios");
const Base_URL = "http://localhost:5001";
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userwithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userwithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User succesfully registered. Now can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop using Async/Await
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching books",
      error: err.message,
    });
  }
});

// Get book details based on ISBN using Promises
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  axios
    .getget(`${BASE_URL}/books/isbn/${isbn}`)
    .then((response) => {
      const book = response.data[isbn];
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching book by ISBN" });
    });
});

// Get book details based on author using Async/Await
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/books/author/${author}`);
    const booksData = response.data;
    const filteredBooks = Object.values(booksData).filter((b) => b.author === author);

    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching author data" });
  }
});

// Get all books based on title using Async/Await
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/books/title/${title}`);
    const booksData = response.data;
    const filteredBooks = Object.values(booksData).filter((b) => b.title === title);

    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching title data" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Review not found" });
  }
});

module.exports.general = public_users;
