const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const request = require("request");

const catchAsync = require("../utilities/catchAsync");

exports.getUsersData = catchAsync(async (req, res, next) => {
  const allSurfers = await query(`select * from surfer`);
  request.post({
    uri: "https://localhost:8000/api/report",
    json: {
        template : {short}
    },
  });
});
