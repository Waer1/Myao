const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const catchAsync = require("../utilities/catchAsync");
const controller = require("./globalController");
exports.getShares = controller.select("share");
exports.createShare = controller.create("share", [], false);
exports.deleteShare = controller.delete("share");

// exports.getShares = catchAsync(async (req, res, next) => {

// });
exports.getPostShares = catchAsync(async (req, res, next) => {
  const post_id = req.params;
  const surfer_ids = await query(
    `select surfer_id from share where post_id="${post_id}"`
  );
  const reducedCondition = surfer_ids.reduce((prev, cur, i) => {
    return `${prev} ${i === 0 ? "" : " , "} "${cur}"`;
  }, "");
  const data = await query(
    `select fname , lname , photo , id from surfer where id IN (${reducedCondition})`
  );
  res.json({
    status: "success",
    data,
  });
});
