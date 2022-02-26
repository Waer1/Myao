const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../controller/authController");
const restriction = restrictTo("surfer");
const {
  acceptRequest,
  beforeRequest,
  // checkFriendship,
  deleteRequest,
  getReceivedRequests,
  getSentRequests,
  makeRequest,
  getMyFriends,
  getFriends,
  getTypeOfRelation,
} = require("../controller/friend");
router.use(protect, restriction);
router.get("/sent", getSentRequests);
router.get("/received", getReceivedRequests);
router.post("/accept", acceptRequest);
router.get("/myFriends", getMyFriends);
router.get("/:surfer_id", getFriends);
router
  .route("/")
  .post(beforeRequest, makeRequest)
  .put(deleteRequest) ///////// deleting and i modfied it cause deleting don't take a body
  .patch(getTypeOfRelation);
module.exports = router;
