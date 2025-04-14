import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const { search } = useLocation();

  const query = new URLSearchParams(search).get('query');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/api/books?search=${query}`);
        setBooks(res.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    if (query) {
      fetchBooks();
    }
  }, [query]);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Search Results for: "{query}"</h2>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default SearchResults;
