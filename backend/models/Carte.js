const mongoose = require("mongoose");
const Quotes = require("./Quotes");
const { Schema } = mongoose;
const Comentariu = require("./Comentariu"); // Importă modelul Comentariu

const carteSchema = new Schema({
  Titlu: {
    type: String,
    required: true,
  },
  Autor: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Autor", 
    required: true,
  },
  Descriere: {
    type: String,
    
  },
  status: {
    type: String,
    enum: ['pending', 'approved'], // ✅ Status posibil
    default: 'pending' // ✅ Implicit "pending"
  },
  coperta:{
    type: String,
    required: true
  },
   
  
  Gen: {
    type: String,
    enum: [
      "Stoicism",
      "Dezvoltare Personală",
      "Motivational",
      "Business",
      "Spiritualitate",
      "Istorie",
      "Religie",
      "Filosofie",
      "Politica",
      "Psihologie",
      "Educatie",
      "Romantism",
      "Literatura",
      "Poezie",
      "Drama",
      "Comedie"
    ],
    required: true,
  },
  AnulAparitiei: {
    type: Number,
    required: true,
  },
  comentarii: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comentariu", // referință la modelul Comentariu
  }],
  saved: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    default: []
  },

  quotes:{
    type: Schema.Types.ObjectId,
    ref: "Quotes",
    
  }
});

module.exports = mongoose.model("Carte", carteSchema);