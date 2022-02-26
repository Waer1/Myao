const express = require("express");
const router = express.Router();
const {
  protect,
  transferParamsToBody,
  restrictTo,
} = require("../controller/authController");
const {
  deleteReport,
  getMyReports,
  getReportedReports,
  getReportsForTables,
  makeReport,
  getPostReports,
  getMarketerReports,
  getSurferReports,
  getProductReports,
  deactivate,
} = require("../controller/report");
router
  .route("/")
  .post(protect, restrictTo("surfer", "marketer"), makeReport)
  .get(protect, restrictTo("admin"), getReportsForTables)
  .delete(protect, restrictTo("admin"), deleteReport);
router.get("/myReports", getMyReports);
router.get("/post", protect, restrictTo("admin"), getPostReports);
router.get("/marketer", protect, restrictTo("admin"), getMarketerReports);
router.get("/surfer", protect, restrictTo("admin"), getSurferReports);
router.get("/product", protect, restrictTo("admin"), getProductReports);
router
  .route("/:reporter_id")
  .get(transferParamsToBody, protect, restrictTo("admin"), getReportedReports);
router.post("/block", protect, restrictTo("admin"), deactivate);

module.exports = router;
