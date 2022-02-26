const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const controller = require("./globalController");
const catchAsync = require("../utilities/catchAsync");
exports.getLikes = controller.select("like");
exports.getPostLikes = catchAsync(async (req, res, next) => {
  const { post_id } = req.params;
  const data = await query(
    `select fname , lname , photo , surfer.id as surfer_id , like_time , \`like.type\` as like_type
     from \`like\` JOIN surfer ON \`like\`.surfer_id = surfer.id 
     WHERE \'like\'.post_id = "${post_id}"`
  );
  res.json({
    status: "success",
    data,
  });
});

exports.createLike = controller.create("like", [], false);
exports.deleteLike = controller.delete("like");
exports.updateLike = controller.updateNonPrimary(
  "like",
  ["type"],
  ["surfer_id", "post_id"]
);
