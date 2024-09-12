const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'] 
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  lessons: [{ 
    type: String 
  }],
  quizzes: [{ 
    type: mongoose.Schema.Types.Mixed 
  }],
  assignments: [{ 
    type: mongoose.Schema.Types.Mixed 
  }],
  categories: [{ 
    type: String 
  }],
  tags: [{ 
    type: String 
  }],
  file: { 
    type: String
  },
  youtubeUrl: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  // creator: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'User', 
  //   required: [true, 'Creator is required'] 
  // }
  progress: {
    type: Map,
    of: {
      completedLessons: [mongoose.Schema.Types.ObjectId],
      completedQuizzes: [mongoose.Schema.Types.ObjectId],
      completedAssignments: [mongoose.Schema.Types.ObjectId],
      videoProgress: { // New field
        type: Map,
        of: {
          videoId: String,
          timeWatched: Number, // Store time in seconds
        },
      },
    },
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
