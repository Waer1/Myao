const express = require("express");
const { append } = require("express/lib/response");
const {
  transferParamsToBody,
  protect,
  restrictTo,
} = require("../controller/authController");
const restriction = restrictTo("surfer", "admin");
const likeController = require("../controller/like");
const AppError = require("../utilities/appError");
const router = express.Router({ mergeParams: true });

router.get(
  "/likes",
  (req, res, next) => {
    if (!req.params.post_id)
      return next(new AppError("invalid router without chosen post"));
    next();
  },
  likeController.getPostLikes
);
router.post(
  "/like",
  transferParamsToBody,
  protect,
  restriction,
  (req, res, next) => {
    req.body.surfer_id = req.auth.id;
    next();
  },
  likeController.createLike
);
router.post(
  "/unlike",
  transferParamsToBody,
  protect,
  restriction,
  likeController.deleteLike
);
router.patch(
  "/like",
  transferParamsToBody,
  protect,
  restriction,
  likeController.updateLike
);

//TODO: add like here
// router.use("/:like_id");
module.exports = router;
