

const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  languages: {
    type: String,
    required: true,
  },
  courseDescription: {
    type: String,
    required: true, // Assuming this field is required
  },
  courseDuration: {
    type: String,
    required: true, // Assuming this field is required
  },
  targetAudience: {
    type: String,
    required: true, // Assuming this field is required
  },
  courseCategory: {
    type: String,
    required: true, // Assuming this field is required
  },
  roadmapIntroduction: {
    type: String,
    required: false,
  },
  firstChapter: {
    type: String,
    required: false,
  },
  secondChapter: {
    type: String,
    required: false,
  },
  thirdChapter: {
    type: String,
    required: false,
  },
  fourthChapter: {
    type: String,
    required: false,
  },
  fifthChapter: {
    type: String,
    required: false,
  },
  sixthChapter: {
    type: String,
    required: false,
  },
  seventhChapter: {
    type: String,
    required: false,
  },
  eighthChapter: {
    type: String,
    required: false,
  },
  ninthChapter: {
    type: String,
    required: false,
  },
  tenthChapter: {
    type: String,
    required: false,
  },
  pdfPrice: {
    type: Number, // Adding pdfPrice field
    required: true, // You can set this to false if it's optional
  },
  image: {
    type: String, // This will store the image URL as a string
    required: false, // Set to true if the image is mandatory
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FormData', formDataSchema);
