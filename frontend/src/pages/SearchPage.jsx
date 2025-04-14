import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BookCard from "./books/BookCard";

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get("query");

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!query || query.trim() === "") {
                setBooks([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/books/search`,
                    {
                        params: { query },
                        timeout: 5000,
                    }
                );

                if (response.data.success) {
                    setBooks(response.data.data);
                } else {
                    setError(response.data.message || "No results found");
                }
            } catch (err) {
                let errorMessage = "Failed to search books";
                if (err.response) {
                    errorMessage =
                        err.response.data?.message ||
                        err.response.data?.error ||
                        `Server error: ${err.response.status}`;
                }
                setError(errorMessage);
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [query]);

    return (
        <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-8">
            <h2 className="text-3xl font-semibold mb-8 text-center">
                {loading
                    ? "Searching books..."
                    : books.length > 0
                    ? `Results for "${query}"`
                    : `No results for "${query}"`}
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-xl mx-auto">
                    <strong className="font-bold">Error:</strong>{" "}
                    <span className="block sm:inline">{error}</span>
                    <button
                        onClick={() => navigate(`/search?query=${query}`)}
                        className="ml-4 mt-2 sm:mt-0 px-3 py-1 bg-blue-500 text-white rounded"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && books.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                    {books.map((book) => (
                        <div key={book._id}>
                            <BookCard book={book} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;