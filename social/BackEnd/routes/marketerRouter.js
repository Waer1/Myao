const express = require("express");
const app = require("../app");

const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const marketerController = require("../controller/marketer");
const productRouter = require("./productRouter");
const router = express.Router();

router
  .route("/")
  .get((req, res, next) => {
    req.body.is_active = 1;
    next();
  }, marketerController.getMarketers)
  .post(protect, restrictTo("admin"), marketerController.createMarketer);
router.route("/search").get(marketerController.searchMarketer);
router
  .route("/:id")
  .get(
    transferParamsToBody,
    (req, res, next) => {
      req.body.is_active = 1;
      next();
    },
    marketerController.getMarketers
  )
  .patch(
    transferParamsToBody,
    protect,
    restrictTo("admin"),
    marketerController.updateMarketer
  )
  .delete(
    transferParamsToBody,
    protect,
    restrictTo("admin"),
    marketerController.delete
  );
//TODO:
// may be removed
router.use("/:marketer_id", productRouter); // add post router here

module.exports = router;
