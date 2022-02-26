const connection = require("../connection");
const controller = require("./globalController");
const catchAsync = require("../utilities/catchAsync");
const { promisify } = require("util");
const { uniqueIdGenerator } = require("../utilities/control");
const query = promisify(connection.query).bind(connection);
exports.getComments = catchAsync(async (req, res, next) => {
  const data = await query(
    `select * from comment JOIN surfer ON 
    comment.surfer_id = surfer.id 
    where comment.post_id="${req.body.post_id}"`
  );
  res.json({
    status: "success",
    data,
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const id = uniqueIdGenerator("comment");
  const { post_id, content, created_time } = req.body;
  const data = await query(
    `call insert_comment("${post_id}" , "${req.auth.id}" , "${content}" , "${created_time}" , "${id}")`
  );
  res.json({
    status: "success",
    data,
  });
});
exports.updateComment = controller.update("comment", [
  "id",
  "post_id",
  "surfer_id",
  "comment_time",
]);
exports.deleteComment = controller.delete("comment");
