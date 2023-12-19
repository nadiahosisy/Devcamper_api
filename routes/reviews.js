const express = require("express");

const { getReviews, getReview, addReview } = require("../controllers/reviews");

const Review = require("../models/Review");

const router = express.Router({
  mergeParams: true,
});

const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResult(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);
router.route("/:id").get(getReview);

module.exports = router;
