const express = require("express");

const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const postMediaController = require("../controller/post_media");
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(transferParamsToBody, postMediaController.getPostMedia)
  .post(
    transferParamsToBody,
    protect,
    restrictTo("admin", "user"),
    postMediaController.createPostMedia
  );
router
  .route("/:id")
  .get(transferParamsToBody, postMediaController.getPostMedia)
  .patch(
    transferParamsToBody,
    protect,
    restrictTo("admin", "user"),
    postMediaController.updatePostMedia
  )
  .delete(
    transferParamsToBody,
    protect,
    restrictTo("admin", "user"),
    postMediaController.deletePostMedia
  );

module.exports = router;
