const app = require("../app");
const connection = require("../connection");
const controller = require("./globalController");

exports.getAdmins = controller.select("admin");
exports.createAdmin = controller.create("admin");
exports.updateAdmin = controller.update("admin", ["admin_id", "gender"]); // don't update the id(constant attribute)
exports.deleteAdmin = controller.delete("admin");