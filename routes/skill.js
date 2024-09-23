const express = require('express');
const multer = require('multer');
const router = express.Router();
const Skill = require('../models/skills');
const FormData = require('../models/FormData');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profilePictures'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save files with a timestamp to avoid name collisions
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
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// POST route to add a new skill with an optional profile picture and email from session storage
router.post('/', upload.single('profilePicture'), async (req, res) => {
  const { profileName, skillCategory, email } = req.body;  // Email is passed from frontend
  const profilePicture = req.file ? `/uploads/profilePictures/${req.file.filename}` : null;

  try {
    // Here you can associate the email with the new skill if needed
    const newSkill = new Skill({
      profileName,
      skillCategory,
      profilePicture,
      email, // Save the email to MongoDB
    });
    
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ error: 'Unable to add skill' });
  }
});

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch skills' });
  }
});

// PATCH route to update Skill with FormData ID
router.patch('/:skillId', async (req, res) => {
  try {
    const { formDataId } = req.body;

    // Find the Skill by ID and update its 'user' field with the FormData ID
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.skillId,
      { user: formDataId }, // Ensure you're updating the correct field
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
