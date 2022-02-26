const { paginate } = require("../utilities/postUtilities");
const { promisify } = require("util");
const connection = require("../connection");
const appError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");
const query = promisify(connection.query).bind(connection);
const controller = require("./globalController");
const APIFeatures = require("../utilities/apiFeatures");
const {
  AddWhereCondition,
  filterObjFrom,
  filterObjTo,
  uniqueIdGenerator,
} = require("./../utilities/control");
const columns = require("../utilities/tableColumns.js");

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

exports.uploadPostPhotos = upload.fields([{ name: "media", maxCount: 30 }]);
exports.resizePostPhotos = catchAsync(async (req, res, next) => {
  if (!req.files?.media?.length) return next();
  console.log(req.files.media.length);
  req.body.media = [];
  await Promise.all(
    req.files.media.map(async ({ buffer }, i) => {
      const fileName = `post-img-${i}-${req.auth.id}-${Date.now()}.jpeg`;
      await sharp(buffer)
        .resize(1000, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`../frontend/public/img/posts/${fileName}`);
      req.body.media.push({ link: `/img/posts/${fileName}`, type: 0 });
    })
  );
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

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await query(`SELECT * FROM post WHERE id=${req.body.id}`);
  if (!post) return next(new appError("no post with this id"));
  post.media = (
    await query(`SELECT * FROM post_media WHERE post_id=${post.id}`)
  ).map((media) => media.link);
  return res.json({
    status: "success",
    data: post,
  });
});

const detailedPosts = async (posts, userId) => {
  if (posts.length === 0) return [];
  let postsHashed = {};
  await Promise.all(
    posts.map(async (post) => {
      const [surfer_info, like_counter, if_liked] = await Promise.all([
        query(
          `select fname , lname , photo from surfer where id="${post.surfer_id}"`
        ),
        query(
          `select count(*) as like_counter from \`like\` where post_id="${post.id}"`
        ),
        query(
          `select * from \`like\` where post_id="${post.id}" and surfer_id="${userId}"`
        ),
      ]);
      postsHashed[post.id] = {
        ...post,
        media: [],
        surfer_info: surfer_info[0],
        like_counter: like_counter[0].like_counter,
        liked: if_liked.length > 0,
      };
    })
  );
  // return res.json({ posts, postsHashed });
  const reducedCondition = posts.reduce(
    (prev, cur, index) =>
      `${prev} ${index == 0 ? "'" + cur.id + "'" : "," + "'" + cur.id + "'"}`,
    ""
  );
  const posts_media = await query(
    `SELECT * FROM post_media WHERE post_id IN (${reducedCondition})`
  );
  posts_media.forEach(({ post_id, link }) =>
    postsHashed[post_id].media.push(link)
  );
  return Object.values(postsHashed);
};
exports.getAllPosts = catchAsync(async (req, res, next) => {
  if (req.body.surfer_id) req.query.surfer_id = req.body.surfer_id;
  const queryStr = new APIFeatures("post", req.query)
    .filter()
    .sort()
    .paginate().query;
  const posts = await query(queryStr);
  if (posts.length === 0)
    return res.json({
      status: "success",
      data: posts,
    });
  let postsHashed = {};
  posts.forEach((post) => {
    postsHashed[post.id] = { ...post, media: [] };
  });
  const reducedCondition = posts.reduce(
    (prev, cur, index) =>
      `${prev} ${index == 0 ? "'" + cur.id + "'" : "," + "'" + cur.id + "'"}`,
    ""
  );
  const posts_media = await query(
    `SELECT * FROM post_media WHERE post_id IN (${reducedCondition})`
  );
  posts_media.forEach(({ post_id, link }) =>
    postsHashed[post_id].media.push(link)
  );
  res.json({
    status: "success",
    data: Object.values(postsHashed),
  });
});

exports.getSinglePost = catchAsync(async (req, res, next) => {
  const posts = await query(`select * from post where id="${req.body.id}"`);
  const data = await detailedPosts(posts, req.auth.id);
  res.json({
    status: "success",
    data,
  });
});
exports.getSinglePost = catchAsync(async (req, res, next) => {
  const data = await getSurferPosts(
    req.auth?.id,
    "",
    `post.id = "${req.body.id}"`,
    req.query
  );
  res.json({
    status: "success",
    data,
  });
});
exports.getMyPosts = catchAsync(async (req, res, next) => {
  req.query.surfer_id = req.auth?.id;
  if (!req.query.surfer_id) return next(new appError("unexpected error"));
  const queryStr = new APIFeatures("post", req.query)
    .filter()
    .sort()
    .paginate().query;
  const posts = await query(queryStr);
  const data = await detailedPosts(posts, req.auth.id);
  res.json({
    status: "success",
    data,
  });
});
exports.getMyPosts = catchAsync(async (req, res, next) => {
  const data = await getSurferPosts(
    req.auth.id,
    "",
    `post.surfer_id = "${req.auth.id}"`,
    req.query
  );
  res.json({
    status: "success",
    data,
  });
});
exports.getUserPosts = catchAsync(async (req, res, next) => {
  if (req.body.surfer_id) req.query.surfer_id = req.body.surfer_id;
  else return next(new appError("surfer_id must be given"));
  const queryStr = new APIFeatures("post", req.query)
    .filter()
    .sort()
    .paginate().query;
  const posts = await query(queryStr);
  const data = await detailedPosts(posts, req.auth?.id);
  res.json({
    status: "success",
    data,
  });
});
exports.getUserPosts = catchAsync(async (req, res, next) => {
  const data = await getSurferPosts(
    req.auth.id,
    "",
    `post.surfer_id = "${req.body.surfer_id}"`,
    req.query
  );
  res.json({
    status: "success",
    data,
  });
});
exports.getPosts = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const posts = await query(
    addWhereCondition(
      `SELECT * FROM post`,
      // filterObjTo(req.body, columns["post"])
      req.body
    )
  );
  if (posts.length === 0)
    return res.json({
      status: "success",
      data: posts,
    });
  let postsHashed = {};
  posts.forEach((post) => {
    postsHashed[post.id] = { ...post, media: [] };
  });
  const reducedCondition = posts.reduce(
    (prev, cur, index) =>
      `${prev} ${index == 0 ? "'" + cur.id + "'" : "," + "'" + cur.id + "'"}`,
    ""
  );
  const posts_media = await query(
    `SELECT * FROM post_media WHERE post_id IN (${reducedCondition})`
  );
  posts_media.forEach(({ post_id, link }) =>
    postsHashed[post_id].media.push(link)
  );
  res.json({
    status: "success",
    data: Object.values(postsHashed),
  });
});
exports.createPost = catchAsync(async (req, res, next) => {
  const { media: postMedia } = req.body;
  try {
    const id = uniqueIdGenerator("post");
    req.body["id"] = id;
    req.body["has_multimedia"] = 0;
    delete req.body.media;
    if (postMedia?.length > 0) req.body["has_multimedia"] = 1;
    req.body.surfer_id = req.auth.id;
    const post = await query(
      `INSERT INTO post set ? `,
      // filterObjTo(req.body, columns["post"])
      req.body
    );
    if (!postMedia?.length)
      return res.json({
        status: "success",
        data: post,
      });
    const media = postMedia.map(({ link, type }) => [
      uniqueIdGenerator("MEPO"),
      type,
      id,
      link,
    ]);
    const post_media = await query(
      "INSERT INTO post_media (id , type , post_id , link) VALUES ?",
      [media]
    );
    return res.json({ status: "success", post_media });
  } catch (err) {
    postMedia?.length &&
      (await Promise.all(
        postMedia.map(({ link }) => unlink(`../FrontEnd/public${link}`))
      ));
    throw err;
  }
});
exports.deletePost = controller.delete("post"); // post media on delete cascade
exports.updatePost = catchAsync(async (req, res, next) => {
  const Obj = filterObjFrom(req.body, ["id", "created_date", "surfer_id"]);
  if (Object.keys(Obj).length === 0)
    return res.json({
      status: "success",
      data: "clown update request, no data changed",
    });
  const post = await query(`UPDATE post SET ? WHERE id='${req.body.id}'`, Obj);
  if (post.affectedRows === 0)
    return res.json({
      status: "failed",
      err: "wrong post id",
    });
  const { media } = req.body;
  res.json({
    status: "success",
    data: post,
  });
});

exports.getTimeLine = catchAsync(async (req, res, next) => {
  const { id } = req.auth;
  const posts = await query(
    paginate(
      `SELECT post.id , post.post_text , post.surfer_id , post.created_date , post.comment_counter 
     FROM post JOIN friend 
    WHERE (friend.source_id=post.surfer_id AND friend.target_id="${id}")
    OR (friend.target_id=post.surfer_id AND friend.source_id="${id}")
    AND friendship_time IS NOT NULL`,
      req.query.page,
      req.query.limit
    )
  );
  const data = await detailedPosts(posts, req.auth?.id);
  res.json({
    status: "success",
    data,
  });
});
// exports.getTimeLine = catchAsync(async (req, res, next) => {
//   const data = await getSurferPosts(
//     req.auth.id,
//     `JOIN friend
//     ON (friend.source_id = post.surfer_id AND friend.target_id = "${req.auth.id}")
//     OR (friend.target_id = post.surfer_id AND friend.source_id = "${req.auth.id}")
//     `,
//     `friendship_time IS NULL`,
//     req.query
//   );
//   res.json({
//     status: "success",
//     data,
//   });
// });
// get posts with person information
// if liked , count
