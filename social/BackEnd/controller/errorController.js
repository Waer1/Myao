module.exports = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: "error",
    message: err.message,
  });
};
