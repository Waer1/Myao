// const crypto = require("crypto");
const catchAsync = require("../utilities/catchAsync");
const jwt = require("jsonwebtoken");
const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const {
  correctPassword,
  hashPassword,
  passwordChangedAfter,
  createPasswordResetToken,
} = require("../utilities/security");
const appError = require("../utilities/appError");
const {
  uniqueIdGenerator,
  filterObjFrom,
  filterObjTo,
} = require("../utilities/control");
const columns = require("../utilities/tableColumns");
exports.transferParamsToBody = (req, res, next) => {
  for (const [key, val] of Object.entries(req.params)) {
    req.body[key] = val;
  }
  next();
};
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sharp = require("sharp");
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new appError("not an image! please provide an image"));
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");
exports.uploadUserPhoto = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "cover_photo", maxCount: 1 },
]);
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.files?.cover_photo && !req.files?.photo) return next();

  if (req.files.cover_photo) {
    req.body.cover_photo = `user-cover-${req.auth.id}.jpeg`;
    await sharp(req.files.cover_photo[0].buffer)
      .resize(2500, 1000)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`../FrontEnd/public/img/users/${req.body.cover_photo}`);
    req.body.cover_photo = `/img/users/${req.body.cover_photo}`;
  }
  if (req.files.photo) {
    req.body.photo = `user-photo-${req.auth.id}.jpeg`;
    await sharp(req.files.photo[0].buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`../FrontEnd/public/img/users/${req.body.photo}`);
    req.body.photo = `/img/users/${req.body.photo}`;
  }
  next();
});

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id, user.role);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });

  // Remove password from output
  // user.password = undefined;

  console.log(user);
  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  return res.status(200).json({ status: "success" });
};
exports.signup = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (role === "admin")
    return res.json({
      status: "failed",
      error: "555555555555555555555",
    });
  if (!role) return next(new appError("no specific role determined"));
  req.body = filterObjFrom(req.body, ["role"]);
  // req.body = filterObjTo(req.body, columns[role]);
  const id = uniqueIdGenerator(role);
  req.body[columns[role][0]] = id;
  req.body.password = await hashPassword(req.body.password);
  const data = await query(`INSERT INTO ${role} SET ?`, req.body);
  req.body.role = role;

  console.log(req.body.password);
  // const url = `${req.protocol}://${req.get("host")}/me`;
  // // console.log(url);
  // await new Email(newUser, url).sendWelcome();

  createSendToken(req.body, 201, req, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new appError("you must enter email and password"));
  const userTypes = ["surfer", "marketer", "admin"];
  const users = await Promise.all(
    userTypes.map((table) =>
      query(`SELECT * FROM ${table} WHERE email="${email}"`)
    )
  );
  for (let i = 0; i < 3; i++)
    if (
      users[i]?.length !== 0 &&
      (await correctPassword(password, users[i][0].password))
    ) {
      users[i][0].password = undefined;
      if ((users[i][0].is_active === 0))
        return next(new appError("this account is closed"));
      console.log(userTypes[i]);
      return createSendToken(
        { ...users[i][0], role: userTypes[i] },
        200,
        req,
        res
      );
    }
  next(new appError("wrong email or password"));
});

exports.getLogin = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next();

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await query(
    `SELECT * FROM ${decoded.role} WHERE id="${decoded.id}"` // AND is_active = 1` cause the admin
  );
  if (!currentUser) {
    return next();
  }

  // 4) Check if user changed password after the token was issued
  // if (
  //   security.passwordChangedAfter(decoded.iat, currentUser.passwordChangedAt)
  // ) {
  //   return next(
  //     new AppError("User recently changed password! Please log in again.", 401)
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  // req.body[`${decoded.role}_id`] = currentUser[0].id;
  req.auth = { role: decoded.role, id: decoded.id };
  next();
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await query(
    `SELECT * FROM ${decoded.role} WHERE id="${decoded.id}" ${
      decoded.role === "admin" ? "" : "AND is_active = 1"
    }`
  );
  console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  // if (
  //   security.passwordChangedAfter(decoded.iat, currentUser.passwordChangedAt)
  // ) {
  //   return next(
  //     new AppError("User recently changed password! Please log in again.", 401)
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  // req.body[`${decoded.role}_id`] = currentUser[0].id;
  req.auth = { role: decoded.role, id: decoded.id };
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { role, id } = req.auth;
  req.body = filterObjFrom(req.body, [
    "id",
    "created_date",
    "email",
    "passwordChangedAt",
    "passwordResetToken",
    "passwordResetExpires",
    "is_active",
    "last_login",
    "closed_admin",
    "last_published",
    "founded_at",
  ]);
  if (req.file?.filename) req.body.photo = req.file.filename;
  const data = await query(`UPDATE ${role} SET ? WHERE id="${id}"`, req.body);
  res.json({
    status: "success",
    data,
    updatedData: req.body,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const { role, id } = req.auth;
  const data = await query(`UPDATE ${role} SET is_active=0 WHERE id="${id}"`);
  return res.json({
    status: "success",
    data,
  });
});
exports.restrictTo =
  (...roles) =>
  (req, body, next) => {
    if (roles.includes(req.auth.role)) return next();
    next(new appError(`you don't have the permission to make this action`));
  };
exports.changeAuthTo = (newName) => (req, res, next) => {
  req.body[newName] = req.auth.id;
  next();
};
exports.getInfo = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "notAuth",
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await query(
    `SELECT * FROM ${decoded.role} WHERE id="${decoded.id}" AND is_active = 1`
  );

  if (!currentUser) {
    return res.status(401).json({
      status: "notAuth",
    });
  }

  return res.status(200).json({
    status: "success",
    data: currentUser[0],
  });
});

exports.changeUserRole = catchAsync(async (req, res, next) => {
  const { oldRole, newRole, user_id, newData } = req.body;
  const oldUser = (
    await query(`select * from ${oldRole} where id = "${user_id}"`)
  )[0];
  await query(`delete from surfer where id = "${req.body.user_id}"`);
  const newUserData = filterObjTo({ ...oldUser, ...newData }, columns[newRole]);
  const data = await query(`insert into ${newRole} set ?`, newUserData);
  res.json({
    status: "success",
    data,
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await query(`select * from surfer where email = "${email}"`);
  if (!user) return next(new appError("no user with such email"));
  const { resetToken, passwordResetExpires, passwordResetToken } =
    createPasswordResetToken();
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm, role } = req.body;
  const usersDueToId = {
    mar: "marketer",
    sur: "surfer",
  };
  if (newPassword !== newPasswordConfirm)
    return res.json({
      status: "error",
      msg: "password is not the same as password confirm",
    });
  const [{ password: hashedPass }] = await query(
    `select password from ${role} where id = "${req.auth.id}" AND is_active = 1`
  );
  console.log(req.auth.id);
  if (!hashedPass)
    return res.json({
      status: "err",
      msg: "account is deleted!",
    });
  if (!(await correctPassword(currentPassword, hashedPass)))
    return res.json({
      status: "err",
      message: "wrong password",
    });
  const newPasswordHashed = await hashPassword(newPassword);
  const data = await query(
    `update ${role} set password = "${newPasswordHashed}" where id = "${req.auth.id}"`
  );
  res.json({
    status: "success",
    data,
  });
});
