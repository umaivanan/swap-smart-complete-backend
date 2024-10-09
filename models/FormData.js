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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FormData', formDataSchema);
