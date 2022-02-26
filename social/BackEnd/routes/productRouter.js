const express = require("express");

const {
  protect,
  restrictTo,
  transferParamsToBody,
  getLogin,
} = require("../controller/authController");
const restriction = restrictTo("marketer");
const productController = require("../controller/product");
const reviewRouter = require("./reviewRouter");
const productMediaRouter = require("./productMediaRouter");
const router = express.Router();

router
  .route("/")
  .patch(transferParamsToBody, getLogin, productController.getUserProducts)
  .post(
    transferParamsToBody,
    protect,
    restriction,
    productController.uploadPostPhotos,
    productController.resizePostPhotos,
    productController.createProduct
  );
router.get(
  "/myProducts",
  transferParamsToBody,
  protect,
  restrictTo("marketer"),
  productController.getMyProducts
);

router
  .route("/:id")
  .get(transferParamsToBody, productController.getSingleProduct)
  .patch(
    protect,
    restriction,
    productController.uploadPostPhotos,
    productController.resizePostPhotos,
    productController.updateProduct
  )
  .delete(
    protect,
    restrictTo("marketer", "admin"),
    productController.deleteProduct
  );

router.use("/:product_id/review", reviewRouter);
router.use("/:product_id/media", productMediaRouter);
module.exports = router;
