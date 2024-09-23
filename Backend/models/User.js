const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  username: { type: String, required: false },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,  // For users who sign up directly (not via OAuth)
    required: function() {
      return !this.googleId && !this.facebookId;  // Only require password if not signing in via Google or Facebook
    }
  },
  googleId: {
    type: String, // To store the Google OAuth user ID
  },
  facebookId: {
    type: String, // To store the Facebook OAuth user ID
  },
  name: {
    type: String
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: {
    type: Map,
    of: {
      videoProgress: {
        type: Map, 
      },
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
