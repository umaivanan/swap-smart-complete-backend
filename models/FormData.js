const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  whereILive: {
    type: String,
    required: true,
  },
  decadeBorn: {
    type: String,
    required: true,
  },
  timeSpent: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  languages: {
    type: String,
    required: true,
  },
  aboutMe: {
    type: String,
    required: true,
  },
  roadmapIntroduction: { // PDF for Roadmap Introduction
    type: String,
    required: false,
  },
  firstChapter: { // PDF for First Chapter
    type: String,
    required: false,
  },
  secondChapter: { // PDF for Second Chapter
    type: String,
    required: false,
  },
  thirdChapter: { // PDF for Third Chapter
    type: String,
    required: false,
  },
  fourthChapter: { // PDF for Fourth Chapter
    type: String,
    required: false,
  },
  fifthChapter: { // PDF for Fifth Chapter
    type: String,
    required: false,
  },
  sixthChapter: { // PDF for Sixth Chapter
    type: String,
    required: false,
  },
  seventhChapter: { // PDF for Seventh Chapter
    type: String,
    required: false,
  },
  eighthChapter: { // PDF for Eighth Chapter
    type: String,
    required: false,
  },
  ninthChapter: { // PDF for Ninth Chapter
    type: String,
    required: false,
  },
  tenthChapter: { // PDF for Tenth Chapter
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  skill: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Skill',  // Reference to Skill schema
    required: true 
  }
}, {
  timestamps: true // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('FormData', formDataSchema);
