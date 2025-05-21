const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Carte = require("./Carte");
const Quotes = require("./Quotes");

const autorSchema = new Schema({
  nume: {
    type: String,
    required: true
  },
  prenume: {
    type: String,
    required: true
  },
  imagine:{
    type: String,
    required: false
  },
  descriere: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  books: [{
    type: Schema.Types.ObjectId,
    ref: 'Carte'
  }],
  quotes: [{
    type: Schema.Types.ObjectId,
    ref: 'Quotes'
  }]
}, {
  timestamps: true // Optional: adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Autor", autorSchema);