const express = require("express");

const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const restriction = restrictTo("marketer");
const productMediaController = require("../controller/product_media");
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(transferParamsToBody, productMediaController.getProductMedia)
  .post(
    transferParamsToBody,
    protect,
    restriction,
    productMediaController.createProductMedia
  );
router
  .route("/:id")
  .get(transferParamsToBody, productMediaController.getProductMedia)
  .patch(
    transferParamsToBody,
    protect,
    restriction,
    productMediaController.updateProductMedia
  )
  .delete(
    transferParamsToBody,
    protect,
    restriction,
    productMediaController.deleteProductMedia
  );

module.exports = router;

// share
// sur_rep_mar
// sur_rep_post
// sur_rep_pro
// sur_rep_sur
// mar_report_mar
// like
// admin
