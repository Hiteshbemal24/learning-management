const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: {
    type: Map,
    of: {
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
      completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId }],
      completedAssignments: [{ type: mongoose.Schema.Types.ObjectId }],
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
