const express = require("express");
const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const restriction = restrictTo("marketer");
const reviewController = require("../controller/review");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(transferParamsToBody, reviewController.getReviews)
  .post(
    transferParamsToBody,
    protect,
    restrictTo("surfer"),
    reviewController.createReview
  );
router
  .route("/:id")
  .get(transferParamsToBody, reviewController.getReviews)
  .patch(
    transferParamsToBody,
    protect,
    restriction,
    reviewController.updateReview
  )
  .delete(
    transferParamsToBody,
    protect,
    restrictTo("surfer", "admin"),
    reviewController.deleteReview
  );

//TODO: add review here
// router.use("/:review_id");
module.exports = router;
