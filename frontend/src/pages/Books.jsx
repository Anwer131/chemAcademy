import React, { useEffect, useState, useContext } from 'react';
import { fetchBooks, deleteBook } from '../services/api';
import AuthContext from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const Books = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);

  // Fetch all books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    loadBooks();
  }, []);

  // Handle deleting a book (admin only)
  const handleDeleteBook = async (bookId) => {
    if (!user?.admin) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (confirmDelete) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter(book => book._id !== bookId));
        alert('Book deleted successfully.');
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete the book.');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        All Books
      </Typography>
      {books.length === 0 ? (
        <Typography align="center">No books available</Typography>
      ) : (
        <Grid container spacing={4}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Author: {book.author}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {book.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    href={book.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </Button>
                  {user?.admin && (
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteBook(book._id)}
                      sx={{ ml: 'auto' }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Books;
