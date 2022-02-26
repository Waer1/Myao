const connection = require("../connection");
const controller = require("./globalController");
const { promisify } = require("util");
const catchAsync = require("../utilities/catchAsync");
const query = promisify(connection.query).bind(connection);
exports.getSurfers = controller.select("surfer");
exports.createSurfer = controller.create("surfer");
exports.updateSurfer = controller.update("surfer", ["id", "created_date"]);
exports.deleteSurfer = (req, res, next) => {
  req.body = { id: req.body.id, is_active: false };
  next();
};
///////////////////////////////// photo
const sharp = require("sharp");
const multer = require("multer");
const AppError = require("../utilities/appError");
const { paginate } = require("../utilities/postUtilities");
const { marketer_get_p } = require("./product");
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("not an image! please provide an image"));
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.auth.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const getSurferPosts = async (
  userId,
  additionalJoin = "",
  additionalCondition = "",
  queryObj
) => {
  const { page, limit } = queryObj;
  const [posts, likes_counter, isLikes, posts_media] = await Promise.all([
    query(
      paginate(
        `
   select post.id as post_id , post.surfer_id as surfer_id ,
  post_text , post.created_date as created_date ,
  comment_counter , fname , lname , photo
  from post JOIN surfer
  ON surfer.id = post.surfer_id
  ${additionalJoin}
  ${additionalCondition === "" ? "" : "where " + additionalCondition}
  `,
        page,
        limit
      )
    ),
    query(
      `select COUNT(*) as like_counter , post.id as post_id
      from post JOIN \`like\` 
      ON post.id = \`like\`.post_id 
      ${additionalJoin}
      ${additionalCondition === "" ? "" : "where " + additionalCondition}
      group by post.id`
    ),
    query(
      `select post.id as post_id from \`like\` JOIN post ON \`like\`.post_id = post.id 
      ${additionalJoin}
      where \`like\`.surfer_id = "${userId}"
      ${additionalCondition === "" ? "" : "AND " + additionalCondition}
      `
    ),
    query(
      `select post.id as post_id , link 
      from post JOIN post_media 
      ON post_media.post_id = post.id 
      ${additionalJoin}
      ${additionalCondition === "" ? "" : "where " + additionalCondition}
      `
    ),
  ]);
  let postHashed = {};
  posts.forEach((post) => {
    const { fname, lname, photo, surfer_id, post_id } = post;
    postHashed[post_id] = {
      ...post,
      surfer_info: {
        fname,
        lname,
        photo,
        surfer_id,
      },
      liked: false,
      like_counter: 0,
      media: [],
    };
  });
  likes_counter.forEach(({ like_counter, post_id }) => {
    if (postHashed.hasOwnProperty(post_id))
      postHashed[post_id].like_counter = like_counter;
  });
  isLikes.forEach(({ post_id }) => {
    if (postHashed.hasOwnProperty(post_id)) postHashed[post_id].liked = true;
  });
  posts_media.forEach(({ link, post_id }) => {
    if (postHashed.hasOwnProperty(post_id))
      postHashed[post_id].media.push(link);
  });
  return Object.values(postHashed);
};

/////////////////////////////////
exports.searchSurfer = catchAsync(async (req, res, next) => {
  const search = req.body.search?.split(" ");
  if (!search) return next(new AppError("can't search for empty string"));
  searchLike = search.reduce((prev, cur) => `${prev}${cur}%`, "%");
  const surfers = await query(
    `SELECT * FROM surfer WHERE CONCAT(fname , lname) LIKE "${searchLike}" AND is_active = 1`
  );
  const posts = await getSurferPosts(
    req.auth?.id,
    "",
    `post_text LIKE "${searchLike}"`,
    req.query
  );
  const products = await marketer_get_p(
    req.auth?.id,
    "",
    `product_text LIKE "${searchLike}" or product_name LIKE "${searchLike}"`,
    req.query
  );
  res.json({
    status: "success",
    data: {
      surfers,
      posts,
      products,
    },
  });
});

exports.deactivate = catchAsync(async (req, res, next) => {
  const { reported_id, removed, reporter_id } = req.body;
  let q1 = undefined;
  if (removed)
    switch (reported_id.substr(0, 3)) {
      case "pos":
        q1 = query(`delete from post where id = "${reported_id}"`);
        break;
      case "pro":
        q1 = query(`delete from product where id ="${reported_id}"`);
        break;
      case "sur":
        q1 = query(
          `update surfer set is_active = 0 where id = "${reported_id}"`
        );
        break;
      case "mar":
        q1 = query(
          `update marketer set is_active = 0 where id = "${reported_id}"`
        );
        break;
      default:
        break;
    }
  const data = await Promise.all([
    q1,
    query(
      `delete from sur_rep_${reported_id.substr(
        0,
        3
      )} where reported_id = "${reported_id}" AND reporter_id = "${reporter_id}"`
    ),
  ]);
  res.json({
    status: "success",
    data,
  });
});

//TODO:
// SELECT * , CONCAT(FName , " " , LName) As Name WHERE Name LIKE (%arr[0]%arr[1]%)
