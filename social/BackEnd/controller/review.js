const connection = require("../connection");
const controller = require("./globalController");
const catchAsync = require("../utilities/catchAsync");
const { promisify } = require("util");
const { uniqueIdGenerator } = require("../utilities/control");
const query = promisify(connection.query).bind(connection);
exports.getReviews = catchAsync(async (req, res, next) => {
  const data = await query(`select review.* , fname , lname , photo from 
  surfer JOIN review ON review.surfer_id = surfer.id
  WHERE review.product_id = "${req.body.product_id}"`);
  res.json({
    status: "success",
    data,
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  req.body.id = uniqueIdGenerator("review");
  const data = await query(`insert into review set ?`, req.body);
  res.json({
    status: "success",
    data,
  });
});
exports.updateReview = controller.update("review", [
  "id",
  "post_id",
  "surfer_id",
  "created_time",
]);
exports.deleteReview = controller.delete("review");
