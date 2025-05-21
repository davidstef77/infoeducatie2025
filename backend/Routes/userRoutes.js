const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/verificareUser');
const Quotes = require('../models/Quotes');
const Carte = require('../models/Carte');




router.get('/:userId/saved', async (req, res) => {
  try {
    const { userId } = req.params;

    const quotes = await Quotes.find({ saved: userId });
    const carti = await Carte.find({ saved: userId });

    res.json({
      quotes,
      carti,
    });
  } catch (error) {
    console.error('Eroare la încărcarea datelor salvate:', error);
    res.status(500).json({ error: 'Eroare la server.' });
  }
});

module.exports = router;