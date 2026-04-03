const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if(isValid(userName)) {
    users.push({"userName" : userName, "password": password})
    return res.status(200).json({ message: "User added successfully."})
  } else {
    return res.status(400).json({message: "User already exists or input invalid"})
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  if (req.params.isbn) {
    let bookDetails = books[req.params.isbn]
     return res.status(200).json(bookDetails);
  } else {
     return res.status(404).json({ message : "ISBN details not found"});
  }
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 
  let authorName = req.params.author.toLowerCase().trim();
  const authorBooks = Object.values(books).filter(book => 
    book.author.toLowerCase().includes(authorName))
  
  if (authorBooks.length === 0) {
      return res.status(404).json({ error: "No books found for author" });
  }
  
  res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  let title = req.params.title.toLowerCase().trim();
  const titleBooks = Object.values(books).filter(book => 
    book.title.toLowerCase().includes(title))
  
  if (titleBooks.length === 0) {
      return res.status(404).json({ error: "No books found for this title" });
  }
  
  res.status(200).json(titleBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
      return res.status(404).json({ error: "ISBN details not found" });
  }

  res.status(200).json(book.reviews);
});

module.exports.general = public_users;
