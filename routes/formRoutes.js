
const express = require('express');
const multer = require('multer');
const router = express.Router();
const FormData = require('../models/FormData');
const Skill = require('../models/skills');
const path = require('path');

// Configure multer for PDF and image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, 'pdfUploads/'); // PDFs go to pdfUploads
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, 'imageUploads/'); // Images go to imageUploads
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename for all files
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for all files
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs and Images (JPEG, PNG) are allowed!'));
    }
  }
});

// POST route for creating form data and associating with skill, including PDFs and images
router.post('/', upload.fields([
  { name: 'roadmapIntroduction', maxCount: 1 },
  { name: 'firstChapter', maxCount: 1 },
  { name: 'secondChapter', maxCount: 1 },
  { name: 'thirdChapter', maxCount: 1 },
  { name: 'fourthChapter', maxCount: 1 },
  { name: 'fifthChapter', maxCount: 1 },
  { name: 'sixthChapter', maxCount: 1 },
  { name: 'seventhChapter', maxCount: 1 },
  { name: 'eighthChapter', maxCount: 1 },
  { name: 'ninthChapter', maxCount: 1 },
  { name: 'tenthChapter', maxCount: 1 },
  { name: 'image', maxCount: 1 } // Add image upload field
]), async (req, res) => {
  try {
    const {
      languages,
      courseDescription,
      courseDuration,
      targetAudience,
      courseCategory,
      pdfPrice, // Single price field for all PDFs
      skillId
    } = req.body;

    // Check if the skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Create new FormData entry with skill association and new schema fields
    const newFormData = new FormData({
      languages,
      courseDescription,
      courseDuration,
      targetAudience,
      courseCategory,
      roadmapIntroduction: req.files.roadmapIntroduction ? req.files.roadmapIntroduction[0].filename : null,
      firstChapter: req.files.firstChapter ? req.files.firstChapter[0].filename : null,
      secondChapter: req.files.secondChapter ? req.files.secondChapter[0].filename : null,
      thirdChapter: req.files.thirdChapter ? req.files.thirdChapter[0].filename : null,
      fourthChapter: req.files.fourthChapter ? req.files.fourthChapter[0].filename : null,
      fifthChapter: req.files.fifthChapter ? req.files.fifthChapter[0].filename : null,
      sixthChapter: req.files.sixthChapter ? req.files.sixthChapter[0].filename : null,
      seventhChapter: req.files.seventhChapter ? req.files.seventhChapter[0].filename : null,
      eighthChapter: req.files.eighthChapter ? req.files.eighthChapter[0].filename : null,
      ninthChapter: req.files.ninthChapter ? req.files.ninthChapter[0].filename : null,
      tenthChapter: req.files.tenthChapter ? req.files.tenthChapter[0].filename : null,
      pdfPrice, // Store the price of the PDFs
      image: req.files.image ? req.files.image[0].filename : null, // Save image path
      skill: skill._id
    });

    await newFormData.save();

    // Associate FormData ID with the Skill
    skill.formDataId = newFormData._id;
    await skill.save();

    res.status(201).json({ message: 'Form data saved successfully', formData: newFormData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Other routes remain unchanged

// Get form data by ID
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

// Get all form data for all users
router.get('/', async (req, res) => {
  try {
    const allFormData = await FormData.find(); // Fetch all form data from MongoDB
    res.json(allFormData); // Return the data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching form data' });
  }
});

// DELETE route to remove form data by ID
router.delete('/:id', async (req, res) => {
  try {
    const formDataId = req.params.id;

    // Find and delete the form data by ID
    const deletedFormData = await FormData.findByIdAndDelete(formDataId);

    if (!deletedFormData) {
      return res.status(404).json({ message: 'Form data not found' });
    }

    // Optionally, remove the association with the skill (if required)
    await Skill.updateMany({ formDataId: formDataId }, { $unset: { formDataId: '' } });

    res.json({ message: 'Form data deleted successfully', formData: deletedFormData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting form data', error: error.message });
  }
});


module.exports = router;
