const express = require('express');
const { isAuthenticated, isAdmin } = require('../middleware/verificareUser');
const router = express.Router();

const Autor = require('../models/Autor');
const Carte = require('../models/Carte');

// Admin Dashboard Route - Check if user is authenticated and admin
router.get('/', async (req, res) => {
  try {
    const autori = await Autor.find({ status: 'pending' }); // Caută autorii în așteptare
    const carti = await Carte.find({ status: 'pending' }); // Caută cărțile în așteptare

    console.log("Autori găsiți:", autori);  // ✅ Adaugă asta pentru debug
    console.log("Cărți găsite:", carti);    // ✅ Adaugă asta pentru debug

    res.render("admin", { autori, carti });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Eroare server' });
  }
});

// Aprobare autor
router.put("/approve/autor/:id", async (req, res) => {
  try {
    await Autor.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.status(200).json({ message: 'Autor aprobat cu succes' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Eroare la aprobarea autorului' });
  }
});

// Aprobare carte
router.put("/approve/carte/:id", async (req, res) => {
  try {
    await Carte.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.status(200).json({ message: 'Carte aprobată cu succes' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Eroare la aprobarea cărții' });
  }
});

module.exports = router;
