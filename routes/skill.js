const express = require('express');
const multer = require('multer');
const router = express.Router();
const Skill = require('../models/skills');
const path = require('path');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profilePictures');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, and .jpeg format allowed!'));
    }
  }
});

// Get all skills or by email if provided
router.get('/', async (req, res) => {
  const { email } = req.query;
  try {
    const skills = email ? await Skill.findOne({ email }) : await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch skills' });
  }
});

// GET route to fetch skill details by skillId
router.get('/:skillId', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST route for creating a skill
router.post('/', upload.single('profilePicture'), async (req, res) => {
  const { profileName, skillCategory, email, preferredLanguage, educationalBackground } = req.body;
  const profilePicture = req.file ? `/uploads/profilePictures/${req.file.filename}` : null;

  try {
    const newSkill = await Skill.create({
      profileName,
      // skillCategory,
      profilePicture,
      email,
      preferredLanguage,
      educationalBackground,
      submittedStatus: true
    });
    res.status(201).json(newSkill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(400).json({ error: 'Unable to add skill' });
  }
});

// Route to check if form is already submitted
router.post('/check-form', async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await Skill.findOne({ email });
    if (existingUser && existingUser.submittedStatus) {
      return res.status(200).json({ formSubmitted: true });
    }
    return res.status(200).json({ formSubmitted: false });
  } catch (error) {
    console.error('Error checking form submission status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH route to update submitted status for a skill
router.patch('/:skillId', async (req, res) => {
  try {
    const { submittedStatus } = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.skillId,
      { submittedStatus },
      { new: true }
    );
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating Skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
