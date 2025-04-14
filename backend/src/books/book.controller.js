const Book = require("./book.model");

// POST a new book
const postABook = async (req, res) => {
    try {
        const newBook = new Book({ ...req.body });
        await newBook.save();
        res.status(200).send({ message: "Book posted successfully", book: newBook });
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({ message: "Failed to create book", error: error.message });
    }
};

// GET all books with optional filtering
const getAllBooks = async (req, res) => {
    try {
        const { category, author, minPrice, maxPrice } = req.query;
        const filter = {};
        
        if (category) filter.category = category;
        if (author) filter.author = author;
        if (minPrice || maxPrice) {
            filter.newPrice = {};
            if (minPrice) filter.newPrice.$gte = Number(minPrice);
            if (maxPrice) filter.newPrice.$lte = Number(maxPrice);
        }
        
        const books = await Book.find(filter).sort({ createdAt: -1 });
        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({ message: "Failed to fetch books", error: error.message });
    }
};

// GET a single book by ID
const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).json({ 
            message: "Failed to fetch book",
            error: error.message 
        });
    }
};

// Advanced search functionality
// const searchBooks = async (req, res) => {
//     try {
//         const { query, category, author, minPrice, maxPrice, trending } = req.query;
        
//         const searchConditions = {};
        
//         // Text search across multiple fields
//         if (query) {
//             searchConditions.$or = [
//                 { title: { $regex: query, $options: 'i' } },
//                 { description: { $regex: query, $options: 'i' } },
//                 { author: { $regex: query, $options: 'i' } }
//             ];
//         }
        
//         // Additional filters
//         if (category) searchConditions.category = { $regex: category, $options: 'i' };
//         if (author) searchConditions.author = { $regex: author, $options: 'i' };
        
//         if (minPrice || maxPrice) {
//             searchConditions.newPrice = {};
//             if (minPrice) searchConditions.newPrice.$gte = Number(minPrice);
//             if (maxPrice) searchConditions.newPrice.$lte = Number(maxPrice);
//         }
        
//         if (trending === 'true') searchConditions.trending = true;
        
//         const books = await Book.find(searchConditions).sort({ createdAt: -1 });
//         res.status(200).json(books);
//     } catch (error) {
//         console.error("Search error:", error);
//         res.status(500).json({ message: "Search failed", error: error.message });
//     }
// };
// const searchBooks = async (req, res) => {
//     try {
//         const { query } = req.query; // Focus on the query parameter
        
//         if (!query) {
//             return res.status(400).json({ message: "Search query is required" });
//         }

//         const books = await Book.find({
//             $or: [
//                 { title: { $regex: query, $options: 'i' } }, // Primary focus on title
//                 { author: { $regex: query, $options: 'i' } }  // Optional: include author
//             ]
//         }).sort({ createdAt: -1 });

//         res.status(200).json(books);
//     } catch (error) {
//         console.error("Search error:", error);
//         res.status(500).json({ message: "Search failed", error: error.message });
//     }
// };
// const searchBooks = async (req, res) => {
//     try {
//         const { query } = req.query;
        
//         // Validate query parameter
//         if (!query || typeof query !== 'string') {
//             return res.status(400).json({ 
//                 success: false,
//                 message: "Search query is required and must be a string"
//             });
//         }

//         // Simple search that works even without text index
//         const books = await Book.find({
//             title: { $regex: query, $options: 'i' }
//         }).sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: books
//         });
//     } catch (error) {
//         console.error("Search error:", error);
//         res.status(500).json({ 
//             success: false,
//             message: "Search failed",
//             error: error.message
//         });
//     }
// };
const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        // Use MongoDB text search with sorting by relevance
        const books = await Book.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        ).sort({
            score: { $meta: "textScore" },  // Sort by relevance
            createdAt: -1                   // Then by newest
        });

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            success: false,
            message: "Search failed",
            error: error.message,
            hint: "Ensure text indexes are properly configured in MongoDB"
        });
    }
};
// UPDATE a book by ID
const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).send({ message: "Book not Found!" });
        }
        res.status(200).send({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        console.error("Error updating book", error);
        res.status(500).send({ message: "Failed to update book", error: error.message });
    }
};

// DELETE a book by ID
const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send({ message: "Book not Found!" });
        }
        res.status(200).send({ message: "Book deleted successfully", book: deletedBook });
    } catch (error) {
        console.error("Error deleting book", error);
        res.status(500).send({ message: "Failed to delete book", error: error.message });
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook,
    searchBooks
};