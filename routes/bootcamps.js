const express = require("express");

const {
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  getBootcampsInRadius,
  bootcampImageUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");

const advancedResults = require("../middleware/advancedResult");

//Include other ressource routers
const courseRouter = require("./courses");

const router = express.Router();
const { protect } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/:id/image").put(protect, bootcampImageUpload);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(deleteBootcamp);
module.exports = router;
