const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('../models/FormData');
const Skill = require('../models/skills'); // Ensure you have a Skill model
const path = require('path');

// Configure multer for file uploads to the new folder 'pdfUploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pdfUploads/'); // Changed to 'pdfUploads'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  }
});

// @route POST /api/formdata
// @desc Save form data to the database and associate it with a skill
router.post('/', upload.array('pdfFiles', 3), async (req, res) => {
  try {
    const {
      whereILive,
      decadeBorn,
      timeSpent,
      work,
      languages,
      aboutMe,
      skillId
    } = req.body;

    // Check if the skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Get filenames of uploaded PDFs
    const pdfFiles = req.files.map(file => file.filename);

    // Create a new FormData entry with the skill ID
    const newFormData = new FormData({
      whereILive,
      decadeBorn,
      timeSpent,
      work,
      languages,
      aboutMe,
      pdfFiles,
      skill: skillId  // Associate FormData with Skill ID
    });

    // Save form data
    await newFormData.save();

    res.status(201).json({ message: 'Form data saved successfully', formData: newFormData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET route to fetch form data by ID or all data
router.get('/:id?', async (req, res) => {
  try {
    const formData = req.params.id
      ? await FormData.findById(req.params.id).populate('skill')
      : await FormData.find().populate('skill');

    if (!formData) return res.status(404).json({ message: 'Form data not found' });

    res.json(formData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
