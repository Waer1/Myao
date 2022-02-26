const connection = require("../connection");
const controller = require("./globalController");
exports.getProductMedia = controller.select("product_media");
exports.createProductMedia = controller.create("product_media", []);
exports.updateProductMedia = controller.update("product_media", ["id" , "product_id"]);
exports.deleteProductMedia = controller.delete("product_media");
