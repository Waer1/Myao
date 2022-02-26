const connection = require("../connection");
const controller = require("./globalController");
exports.getPostMedia = controller.select("post_media");
exports.createPostMedia = controller.create("post_media", []);
exports.updatePostMedia = controller.update("post_media", ["id", "post_id"]);
exports.deletePostMedia = controller.delete("post_media");
