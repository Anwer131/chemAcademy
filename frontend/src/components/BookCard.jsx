import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const BookCard = ({ book }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{book.title}</Typography>
        <Typography variant="subtitle2">Author: {book.author}</Typography>
        <Typography variant="body2">{book.description}</Typography>
        <Button
          variant="contained"
          color="secondary"
          href={book.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
