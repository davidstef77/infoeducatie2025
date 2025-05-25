const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/verificareUser');
const { 
  createQuotes, 
  getQuotes, 
  getAllQuotes, 
  deleteQuotes, 
  toggleLikes,  // Corrected the name to match the controller function
  toggleComments ,
  saveQuote,
  getQuotesByUserId,
} = require('../controllers/quotes');

// Route pentru crearea unui citat
router.post('/create', isAuthenticated, createQuotes);


router.get('/:id', isAuthenticated,  getQuotes);
router.get('/user/:userId', isAuthenticated , getQuotesByUserId);

 // Added the save route


// Route pentru obținerea tuturor citatelor
router.get('/',   getAllQuotes);
router.put('/:id/save', isAuthenticated,  saveQuote); // Added the save route

// Route pentru ștergerea unui citat după ID
router.delete('/:id', isAuthenticated, deleteQuotes); // Added the slash before :id

// Route pentru adăugarea/unlike unui like la citat
router.post('/:id/like', isAuthenticated, toggleLikes); // Added the endpoint for toggling like

// Route pentru adăugarea unui comentariu la citat
router.post('/:id/comment', isAuthenticated, toggleComments); // Added the endpoint for adding comments

module.exports = router;
