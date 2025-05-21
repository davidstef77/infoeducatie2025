const Autor = require("../models/Autor");

// Obține toți autorii
async function getAllAuthors(req, res) {
  try {
    const authors = await Autor.find();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Obține un autor după ID
async function getAuthor(req, res) {
  const { id } = req.params;
  try {
    const author = await Autor.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Autorul nu a fost găsit' });
    }
    res.status(200).json(author);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID invalid' });
    }
    console.error('Eroare la obținerea autorului:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Creează un nou autor
async function requestCreateAuthor(req, res) {
  try {
    const newAuthor = new Autor(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).json({ 
      message: 'Autor creat cu succes',
      data: savedAuthor 
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
}

// Șterge un autor după ID
async function requestDeleteAuthor(req, res) {
  const { id } = req.params;
  try {
    const author = await Autor.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).json({ message: 'Autorul nu a fost găsit' });
    }
    res.status(200).json({ message: 'Autor șters cu succes' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID invalid' });
    }
    res.status(500).json({ message: 'Server error' });
  }
}

// Actualizează informațiile unui autor
async function requestUpdateAuthor(req, res) {
  const { id } = req.params;
  try {
    const updatedAuthor = await Autor.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Autorul nu a fost găsit' });
    }
    
    res.status(200).json({
      message: 'Autor actualizat cu succes',
      data: updatedAuthor
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID invalid' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllAuthors, getAuthor,  requestCreateAuthor, requestDeleteAuthor, requestUpdateAuthor };