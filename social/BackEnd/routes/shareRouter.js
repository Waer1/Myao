const express = require("express");
const {
  transferParamsToBody,
  restrictTo,
  protect,
} = require("../controller/authController");
const restriction = restrictTo("surfer", "admin");
const shareController = require("../controller/share");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(transferParamsToBody, shareController.getShares)
  .post(
    transferParamsToBody,
    protect,
    restriction,
    shareController.createShare
  );
router
  .route("/:id")
  .get(transferParamsToBody, shareController.getShares)
  .delete(
    transferParamsToBody,
    protect,
    restriction,
    shareController.deleteShare
  );

//TODO: add share here
// router.use("/:share_id");
module.exports = router;
