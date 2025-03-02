import React, { useEffect, useState, useContext } from 'react';
import { fetchBooks, deleteBook } from '../services/api';
import AuthContext from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoaderPage from '../components/Loader';

const Books = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(!user) navigate('/login');
  },[user,navigate]);
  // Fetch all books on component mount
  useEffect(() => {
    if(!user) return;
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
      setLoading(false);
    };
    loadBooks();
  }, [user]);

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

  return (loading ? <LoaderPage content="Books"/> : (
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
                  
                  <Box sx={{display:'flex', flexWrap:'wrap', mt:1}}>
                    {book.courses.map((course, index) => (
                      <Chip
                        key={index}
                        label={course.code}
                        size='small'
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`https://drive.google.com/file/d/${book.driveId}/view?usp=sharing`}
                    target="_blank"
                    // rel="noopener noreferrer"
                  >
                    Open
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`https://drive.google.com/uc?export=download&id=${book.driveId}`}
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
  ));
};

export default Books;
