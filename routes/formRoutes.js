const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('../models/FormData');
const Skill = require('../models/skills'); // Ensure you have a Skill model
const path = require('path');

// Configure multer for file uploads to the 'pdfUploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pdfUploads/'); // Store PDFs in 'pdfUploads' folder
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
// Handle multiple individual PDF files for each chapter and roadmap introduction
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
  { name: 'tenthChapter', maxCount: 1 }
]), async (req, res) => {
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

    // Get filenames of uploaded PDF files
    const roadmapIntroduction = req.files.roadmapIntroduction ? req.files.roadmapIntroduction[0].filename : null;
    const firstChapter = req.files.firstChapter ? req.files.firstChapter[0].filename : null;
    const secondChapter = req.files.secondChapter ? req.files.secondChapter[0].filename : null;
    const thirdChapter = req.files.thirdChapter ? req.files.thirdChapter[0].filename : null;
    const fourthChapter = req.files.fourthChapter ? req.files.fourthChapter[0].filename : null;
    const fifthChapter = req.files.fifthChapter ? req.files.fifthChapter[0].filename : null;
    const sixthChapter = req.files.sixthChapter ? req.files.sixthChapter[0].filename : null;
    const seventhChapter = req.files.seventhChapter ? req.files.seventhChapter[0].filename : null;
    const eighthChapter = req.files.eighthChapter ? req.files.eighthChapter[0].filename : null;
    const ninthChapter = req.files.ninthChapter ? req.files.ninthChapter[0].filename : null;
    const tenthChapter = req.files.tenthChapter ? req.files.tenthChapter[0].filename : null;

    // Create a new FormData entry with the skill ID
    const newFormData = new FormData({
      whereILive,
      decadeBorn,
      timeSpent,
      work,
      languages,
      aboutMe,
      roadmapIntroduction,   // Save the roadmap introduction PDF file
      firstChapter,          // Save the first chapter PDF file
      secondChapter,         // Save the second chapter PDF file
      thirdChapter,          // Save the third chapter PDF file
      fourthChapter,         // Save the fourth chapter PDF file
      fifthChapter,          // Save the fifth chapter PDF file
      sixthChapter,          // Save the sixth chapter PDF file
      seventhChapter,        // Save the seventh chapter PDF file
      eighthChapter,         // Save the eighth chapter PDF file
      ninthChapter,          // Save the ninth chapter PDF file
      tenthChapter,          // Save the tenth chapter PDF file
      skill: skillId         // Associate FormData with Skill ID
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
