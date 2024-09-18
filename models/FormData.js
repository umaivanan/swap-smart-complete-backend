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
pdfFiles: {
    type: Array,
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
