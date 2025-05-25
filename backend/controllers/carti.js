const { isAuthenticated, isAdmin } = require('../middleware/verificareUser');
const Carte = require('../models/Carte');
const Utilizator = require('../models/User');
const mongoose = require('mongoose');
const Comentariu = require('../models/Comentariu');

// Obține o carte după ID
async function getBook(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalid' });
  }
  try {
    const book = await Carte.findById(id)
      .populate('quotes') // Populează quotes-urile cărții
      .populate('Autor', ' prenume nume' ,) // (opțional) Populează numele autorului
      
      .populate('comentarii' , 'text' );

    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Cartea nu a fost găsită' });
    }
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    console.error('Eroare la obținerea cărții:', error);
    return res.status(500).json({ status: 'error', message: 'Eroare internă la obținerea cărții' });
  }
}

// Obține toate cărțile
async function getAllBooks(req, res) {
  try {
    const books = await Carte.find().populate('quotes'); // Include quotes în listă
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Creează o nouă carte
async function requestCreateBook(req, res) {
  try {
    const { Titlu, Autor, Descriere, AnulAparitiei, Gen, coperta } = req.body;

    const newBook = new Carte({ Titlu, Autor, AnulAparitiei, Gen, Descriere, coperta });
    const savedBook = await newBook.save();

    res.status(201).json({ message: 'Cartea a fost creată cu succes', data: savedBook });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Eroare internă la crearea cărții' });
  }
}

// Șterge o carte
async function deleteBook(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalid' });
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const book = await Carte.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Cartea nu a fost găsită' });
    }

    res.status(200).json({ status: 'success', message: 'Cartea a fost ștearsă cu succes' });
  } catch (error) {
    console.error('Eroare la ștergerea cărții:', error);
    return res.status(500).json({ status: 'error', message: 'Eroare internă la ștergerea cărții' });
  }
}
async function addComentariu(req, res) {
  const { id } = req.params; // id-ul cărții
  const { user, text } = req.body;

  // Validări de bază
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalid pentru carte' });
  }

  if (!user || !mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: 'ID invalid pentru utilizator' });
  }



  try {
    const carte = await Carte.findById(id);
    if (!carte) {
      return res.status(404).json({ message: 'Cartea nu a fost găsită' });
    }

    const comentariu = new Comentariu({
      carteId: id,
      user,
      text
    });
    await comentariu.save();

    // Adaugă comentariul la carte
    carte.comentarii.push(comentariu._id);
    await carte.save();

    return res.status(201).json({ message: 'Comentariu adăugat cu succes', comentariu });
  } catch (error) {
    console.error('Eroare la adăugarea comentariului:', error);
    return res.status(500).json({ message: 'Eroare la adăugarea comentariului' });
  }
}
// Obține comentarii (nefolosit dacă le incluzi deja în getBook)
async function getComentarii(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalid' });
  }

  try {
    const carte = await Carte.findById(id).populate({
      path: 'comentarii',
      populate: {
        path: 'user',
        select: 'nume',
      },
    });

    if (!carte) {
      return res.status(404).json({ message: "Cartea nu a fost găsită" });
    }

    res.json(carte.comentarii);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Eroare la obținerea comentariilor" });
  }
}




async function saveCarte(req, res) {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Autentificare necesară" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalid" });
  }

  try {
    const carte = await Carte.findByIdAndUpdate(
      id,
      { $addToSet: { saved: userId } },
      { new: true, runValidators: true }
    ).populate('saved', '_id nume');

    if (!carte) {
      return res.status(404).json({ message: "Cartea nu a fost găsită" });
    }

    res.status(200).json({
      status: "success",
      data: carte
    });
  } catch (error) {
    console.error('Eroare la salvarea cărții:', error);
    res.status(500).json({ message: 'Eroare la salvarea cărții' });
  }
}







module.exports = {
  getBook,
  getAllBooks,
  requestCreateBook,
  deleteBook,
  addComentariu,
  getComentarii,
  saveCarte,
 
};
