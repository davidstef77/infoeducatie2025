const mongoose = require('mongoose');
const { Schema } = mongoose;



const quoteSchema = new Schema({
  text: {
    type: String,
    required: true,
    unique: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carte",
    required: true,
   
    
  },
  autorul: {
    type: Schema.Types.ObjectId,
    ref: 'Autor',
    required: true,
    
  },
  genul: {
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   
  },
  userName: {
    type: String,
    required: true,
   
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  saved: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    default: []
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comentariu"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Înainte de a salva citatul, preluăm genul din carte


module.exports = mongoose.model("Quotes", quoteSchema);
