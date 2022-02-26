const bcrypt = require("bcryptjs");
exports.hashPassword = async (password) => await bcrypt.hash(password, 12);
exports.correctPassword = async (password, hashedPassword) =>
  await bcrypt.compare(password, hashedPassword);
exports.passwordChangedAfter = (JWTTimestamp, passwordChangedAt) =>
  passwordChangedAt &&
  JWTTimestamp < parseInt(passwordChangedAt.getTime() / 1000, 10);
exports.createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken, passwordResetToken);
  return {
    resetToken,
    passwordResetToken,
    passwordResetExpires,
  };
};
