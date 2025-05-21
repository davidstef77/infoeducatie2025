const mongoose = require('mongoose');

const comentariuSchema = new mongoose.Schema({
  carteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carte',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // adaugă createdAt și updatedAt automat
});

const Comentariu = mongoose.model('Comentariu', comentariuSchema);

module.exports = Comentariu;
