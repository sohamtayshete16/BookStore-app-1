const express = require('express');
const { 
    postABook, 
    getAllBooks, 
    getSingleBook, 
    UpdateBook, 
    deleteABook,
    searchBooks
} = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router = express.Router();

// POST - Create a new book
router.post("/create-book", verifyAdminToken, postABook);
router.get("/search", searchBooks);
router.get("/", getAllBooks);
// Add to your requires
const validateObjectId = require('../middleware/validateObjectId');

// Update the single book route
router.get("/:id", validateObjectId, getSingleBook);
router.put("/edit/:id", validateObjectId, verifyAdminToken, UpdateBook);
router.delete("/:id", validateObjectId, verifyAdminToken, deleteABook);

// router.get("/:id", getSingleBook);
// // GET - All books (with optional query filters)
// // router.get("/", getAllBooks);

// // GET - Single book by ID
// // router.get("/:id", getSingleBook);

// // PUT - Update a book
// router.put("/edit/:id", verifyAdminToken, UpdateBook);

// // DELETE - Remove a book
// router.delete("/:id", verifyAdminToken, deleteABook);

// GET - Advanced search endpoint
// router.get("/search", searchBooks);

module.exports = router;