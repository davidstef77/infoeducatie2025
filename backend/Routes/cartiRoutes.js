const express = require('express');
const router = express.Router();

const {
  getAllBooks,
  getBook,
  requestCreateBook,
  deleteBook,
  getComentarii,
  addComentariu,
  likeCarte,
  saveCarte,
  hasLiked,
 
} = require('../controllers/carti');

const { isAdmin, isAuthenticated } = require('../middleware/verificareUser');

// 📚 Cărți
router.get('/', getAllBooks);
router.get('/:id', getBook);
router.post('/create',  requestCreateBook); // Adaugă verificare admin în controller dacă nu o faci aici
router.delete('/:id',isAuthenticated, deleteBook);

// 💬 Comentarii
router.post('/:id/comentariu', addComentariu);
router.get('/:id/comentarii', getComentarii);

// ❤️ Like carte


// 💾 Salvare carte
router.put('/:id/save',isAuthenticated, saveCarte);

// ✅ Status like/salvat

module.exports = router;
