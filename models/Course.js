const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "please add a description"],
  },
  week: {
    type: String,
    required: [true, "please add a number of week"],
  },
  tuition: {
    type: Number,
    required: [true, "please add a number of tuition cost"],
  },
  minimumSkill: {
    type: Number,
    required: [true, "please add a number of minimum skill"],
    enum: ["beginner", "intermediate", "advenced"],
  },
});
