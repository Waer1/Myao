const express = require("express");
const app = require("../app");

const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const adminController = require("../controller/admin");
const router = express.Router();

router
  .route("/")
  .get(adminController.getAdmins)
  .post(protect, restrictTo("admin"), adminController.createAdmin);
router
  .route("/:id")
  .get(transferParamsToBody, adminController.getAdmins)
  .patch(
    transferParamsToBody,
    protect,
    restrictTo("admin"),
    adminController.updateAdmin
  )
  .delete(
    transferParamsToBody,
    protect,
    restrictTo("admin"),
    adminController.deleteAdmin,
    adminController.updateAdmin
  );

module.exports = router;
