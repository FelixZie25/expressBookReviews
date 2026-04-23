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
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks;
    res.status(200).send(JSON.stringify(books, null, 4));
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
  const findByIsbn = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  findByIsbn
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: "Error fetching book by isbn", error: err.message }));
});

// Get book details based on author using Async/Await
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const getByAuthor = () => {
      return new Promise((resolve) => {
        const keys = Object.keys(books);
        const filteredBooks = keys.filter((key) => books[key].author === author).map((key) => books[key]);
        resolve(filteredBooks);
      });
    };

    const result = await getByAuthor();
    res.status(200).json(result);
  } catch (errerror) {
    res.status(500).json({ message: "Error fetching book by author", error: err.message });
  }
});

// Get all books based on title using Async/Await
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const getByTitle = () => {
      return new Promise((resolve) => {
        const keys = Object.keys(books);
        const filteredBooks = keys.filter((key) => books[key].title === title).map((key) => books[key]);
        resolve(filteredBooks);
      });
    };

    const result = await getByTitle;
    res.status(200).json(result);
  } catch (errerror) {
    res.status(500).json({ message: "Error fetching book by author", error: err.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "No review found for this isbn", error: err.message });
  }
});

module.exports.general = public_users;
