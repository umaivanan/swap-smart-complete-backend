
const express = require('express');
const multer = require('multer');
const router = express.Router();
const FormData = require('../models/FormData');
const Skill = require('../models/skills');
const path = require('path');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pdfUploads/');
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

// POST route for creating form data and associating with skill
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

    // Create new FormData entry with skill association
    const newFormData = new FormData({
      whereILive,
      decadeBorn,
      timeSpent,
      work,
      languages,
      aboutMe,
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

// Update form data
router.put('/:id', upload.fields([
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
    const { id } = req.params;
    const {
      whereILive,
      decadeBorn,
      timeSpent,
      work,
      languages,
      aboutMe
    } = req.body;

    const existingFormData = await FormData.findById(id);
    if (!existingFormData) {
      return res.status(404).json({ message: 'Form data not found' });
    }

    existingFormData.whereILive = whereILive || existingFormData.whereILive;
    existingFormData.decadeBorn = decadeBorn || existingFormData.decadeBorn;
    existingFormData.timeSpent = timeSpent || existingFormData.timeSpent;
    existingFormData.work = work || existingFormData.work;
    existingFormData.languages = languages || existingFormData.languages;
    existingFormData.aboutMe = aboutMe || existingFormData.aboutMe;

    // Update files if present
    if (req.files.roadmapIntroduction) {
      existingFormData.roadmapIntroduction = req.files.roadmapIntroduction[0].filename;
    }
    if (req.files.firstChapter) {
      existingFormData.firstChapter = req.files.firstChapter[0].filename;
    }
    if (req.files.secondChapter) {
      existingFormData.secondChapter = req.files.secondChapter[0].filename;
    }
    if (req.files.thirdChapter) {
      existingFormData.thirdChapter = req.files.thirdChapter[0].filename;
    }
    if (req.files.fourthChapter) {
      existingFormData.fourthChapter = req.files.fourthChapter[0].filename;
    }
    if (req.files.fifthChapter) {
      existingFormData.fifthChapter = req.files.fifthChapter[0].filename;
    }
    if (req.files.sixthChapter) {
      existingFormData.sixthChapter = req.files.sixthChapter[0].filename;
    }
    if (req.files.seventhChapter) {
      existingFormData.seventhChapter = req.files.seventhChapter[0].filename;
    }
    if (req.files.eighthChapter) {
      existingFormData.eighthChapter = req.files.eighthChapter[0].filename;
    }
    if (req.files.ninthChapter) {
      existingFormData.ninthChapter = req.files.ninthChapter[0].filename;
    }
    if (req.files.tenthChapter) {
      existingFormData.tenthChapter = req.files.tenthChapter[0].filename;
    }

    await existingFormData.save();

    res.status(200).json({ message: 'Form data updated successfully', formData: existingFormData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
