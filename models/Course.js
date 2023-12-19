const mongoose = require("mongoose");
const colors = require("colors");

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
  weeks: {
    type: String,
    required: [true, "please add a number of week"],
  },
  tuition: {
    type: Number,
    required: [true, "please add a number of tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "please add a number of minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after remove
CourseSchema.post("remove", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after tuition update
// CourseSchema.post("findOneAndUpdate", async function (doc) {
//   if (this.tuition != doc.tuition) {
//     await doc.constructor.getAverageCost(doc.bootcamp);
//   }
// });

module.exports = mongoose.model("Course", CourseSchema);
