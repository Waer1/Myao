const express = require("express");

const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const restriction = restrictTo("surfer", "admin");
const locationController = require("../controller/location");
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(transferParamsToBody, locationController.getLocations)
  .post(
    transferParamsToBody,
    protect,
    restriction,
    locationController.createLocation
  );
router
  .route("/:id")
  .get(transferParamsToBody, locationController.getLocations)
  .patch(
    transferParamsToBody,
    protect,
    restriction,
    locationController.updateLocation
  )
  .delete(
    transferParamsToBody,
    protect,
    restriction,
    locationController.deleteLocation
  );

module.exports = router;
