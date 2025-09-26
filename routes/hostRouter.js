const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const hostController = require('../controllers/host');

// =======================
// ✅ Ensure upload folder exists
// =======================
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads folder at:", uploadDir);
}

// =======================
// ✅ Multer config for photo uploads
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({ storage });

// =======================
// ✅ Host Routes
// =======================

// Host Dashboard (stats + homes list)
router.get('/host-home', hostController.hostDashboard);

// Add Home
router.get('/add-home', hostController.addHome);
router.post('/add-home', upload.single('photo'), hostController.createHome);

// Edit Home
router.get('/edit-home/:homeid', hostController.getEditHome);
router.post('/edit-home/:homeid', upload.single('photo'), hostController.updateHome);

// Delete Home
router.post('/delete-home/:homeid', hostController.deleteHome);

module.exports = router;
// Edit Home (GET + POST)
router.get('/edit-home/:homeid', hostController.getEditHome);
router.post('/edit-home/:homeid', upload.single('photo'), hostController.updateHome);
