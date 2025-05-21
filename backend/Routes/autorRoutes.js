const express = require("express");
const router = express.Router();
const {
  getAllAuthors,
  getAuthor,
  requestCreateAuthor,
  requestDeleteAuthor,
  requestUpdateAuthor
} = require("../controllers/autor");
const { isAuthenticated, isAdmin } = require("../middleware/verificareUser");

// Public routes
router.get("/", getAllAuthors); 
router.get("/:id", getAuthor);

// Protected routes
router.post("/create",   requestCreateAuthor);
router.delete("/:id", isAuthenticated, requestDeleteAuthor);
router.put("/:id", isAuthenticated, requestUpdateAuthor);

// Handle 404 for undefined routes
router.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta nu a fost găsită" });
});

module.exports = router;