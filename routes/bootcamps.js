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

//Include other ressource routers
const courseRouter = require("./courses");

const router = express.Router();

const advancedResults = require("../middleware/advancedResult");

const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/:id/image")
  .put(protect, authorize("publisher", "admin"), bootcampImageUpload);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);
module.exports = router;
