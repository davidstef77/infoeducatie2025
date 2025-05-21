const mongoose = require("mongoose");
const Quote = require("../models/Quotes");
const User = require("../models/User");

async function createQuotes(req, res) {
  const { text, bookId, autorul, genul, anulAparitiei, userId, userName } = req.body;

  try {
    const existingQuote = await Quote.findOne({ text });
    if (existingQuote) {
      return res.status(400).json({
        status: "error",
        message: "Citatul există deja"
      });
    }
    const newQuote = new Quote({
      text,
      bookId,
      autorul,
      genul,
      userId,
      userName
    });

    const savedQuote = await newQuote.save();

    res.status(201).json({
      status: "success",
      data: savedQuote,
      message: "Quote created successfully"
    });
  } catch (error) {
    console.error("Quote creation error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
}
 
async function getQuotes(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalid" });
  }

  try {
    const quotes = await Quote.find({ bookId: id });

    if (quotes.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Nu s-au găsit citate pentru această carte"
      });
    }

    res.status(200).json({
      status: "success",
      data: quotes
    });
  } catch (error) {
    console.error("Eroare la căutarea citatelor", error);
    next(error);
  }
}


async function getAllQuotes(req, res, next) {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }); // opțional: ordonare după dată
    res.status(200).json({
      status: "success",
      data: quotes
    });
  } catch (error) {
    console.error("Citatele nu au fost gasite", error);
    next(error);
  }
}

async function deleteQuotes(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalid" });
  }

  try {
    const quote = await Quote.findByIdAndDelete(id);
    if (!quote) {
      return res.status(404).json({
        status: "error",
        message: "Citatul nu a fost gasit"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Citatul a fost sters cu succes"
    });
  } catch (error) {
    console.error("Eroare la stergerea citatului", error);
    next(error);
  }
}

async function toggleLikes(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "ID invalid" });
  }

  try {
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({
        status: "error",
        message: "Citatul nu a fost găsit"
      });
    }

    const alreadyLiked = quote.likes.includes(userId);
    if (alreadyLiked) {
      quote.likes = quote.likes.filter((likeId) => likeId.toString() !== userId);
    } else {
      quote.likes.push(userId);
    }

    await quote.save();
    res.status(200).json({
      status: "success",
      data: quote,
      message: alreadyLiked ? "Like eliminat" : "Like adăugat"
    });
  } catch (error) {
    console.error("Eroare la actualizarea like-ului", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
}

async function toggleComments(req, res, next) {
  const { id } = req.params;
  const { userId, userName, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "ID invalid" });
  }

  try {
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({
        status: "error",
        message: "Citatul nu a fost găsit"
      });
    }

    quote.comments.push({ userId, userName, comment });

    await quote.save();

    res.status(200).json({
      status: "success",
      data: quote,
      message: "Comentariul a fost adăugat cu succes"
    });
  } catch (error) {
    console.error("Eroare la adăugarea comentariului", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
}

async function saveQuote(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  console.log("User ID:", userId);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalid" });
  }

  try {
    const quote = await Quote.findByIdAndUpdate(
      id,
      { $addToSet: { saved: userId } },
      { new: true, runValidators: true }
    ).populate('saved', '_id nume');

    if (!quote) {
      return res.status(404).json({
        status: "error",
        message: "Citatul nu a fost găsit"
      });
    }

    res.status(200).json({
      status: "success",
      data: quote
    });
  } catch (error) {
    console.error("Eroare la salvarea citatului", error);
    res.status(500).json({
      status: "error",
      message: "Eroare internă a serverului"
    });
  }
}

module.exports = {
  createQuotes,
  getQuotes,
  getAllQuotes,
  deleteQuotes,
  toggleLikes,
  toggleComments,
  saveQuote,
  
};
