


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
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure email is unique
  },
  submittedStatus: {
    type: Boolean,
    default: false,
  },
  formDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FormData',
    required: false
  }
});

const Skill = mongoose.model('Skill', SkillSchema);
module.exports = Skill;
