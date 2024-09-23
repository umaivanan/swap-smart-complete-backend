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
    ref: 'FormData', // Referring to the FormData model
    required: false,
  },
  email: {
    type: String,  // Email from session storage
    required: true,  // Make this field required as we expect an email with every submission
  }
});

const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;
