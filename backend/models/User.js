const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  prenume: {
    type: String,
    required: true,
  },
  nume: {
    type: String,
    required: true,
  },
  imagine:{
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  parola: {
    type: String,
    required: true,
  },
  preferinteGen:{
    type: String,
    enum: [
      "Stoicism",
      "Dezvoltare Personala",
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
  creat: {
    type: Date,
    default: Date.now,
  }
});

// Middleware pentru a hash-ui parola înainte de salvare
userSchema.pre('save', async function(next) {
  if (!this.isModified('parola')) {
    return next(); // Dacă parola nu este modificată, continuăm fără a o hash-ui
  }

  try {
    const salt = await bcrypt.genSalt(10); // Creează un salt
    this.parola = await bcrypt.hash(this.parola, salt); // Hashuiește parola cu salt
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
