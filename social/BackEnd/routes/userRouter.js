const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  signup,
  updateMe,
  deleteMe,
  getInfo,
  uploadUserPhoto,
  resizeUserPhoto,
  changeUserRole,
  updatePassword,
  protect,
  restrictTo,
} = require("../controller/authController");
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", protect, logout);
router.post("/changePassword", protect, updatePassword);
router
  .route("/me")
  .get(getInfo)
  .patch(protect, uploadUserPhoto, resizeUserPhoto, updateMe)
  .delete(protect, deleteMe);
router.post("/changeRole", protect, restrictTo("admin"), changeUserRole);
module.exports = router;
