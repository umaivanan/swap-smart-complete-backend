const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  profileName: {
    type: String,
    required: true,
  },
  skillCategory: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FormData', // Ensure it's correctly referring to the FormData model
    required: false
  }
});

const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;
