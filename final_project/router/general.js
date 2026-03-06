const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
      if (!doesExist(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await new Promise((resolve, reject) => {
            resolve(books);
        });
        res.send(JSON.stringify(response, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error fetching books"});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) resolve(book);
            else reject("Book not found");
        });
        res.send(JSON.stringify(response, null, 4));
    } catch (error) {
        res.status(404).json({message: error});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            const booksByAuthor = bookKeys
                .filter(key => books[key].author === author)
                .map(key => books[key]);
            if (booksByAuthor.length > 0) resolve(booksByAuthor);
            else reject("No books found for this author");
        });
        res.send(JSON.stringify(response, null, 4));
    } catch (error) {
        res.status(404).json({message: error});
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            const booksByTitle = bookKeys
                .filter(key => books[key].title === title)
                .map(key => books[key]);
            if (booksByTitle.length > 0) resolve(booksByTitle);
            else reject("No books found for this title");
        });
        res.send(JSON.stringify(response, null, 4));
    } catch (error) {
        res.status(404).json({message: error});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
