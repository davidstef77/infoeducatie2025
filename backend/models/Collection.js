const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phrase'
  }],
  coverImage: String,
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);