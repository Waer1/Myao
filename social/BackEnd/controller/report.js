const connection = require("../connection");
const { promisify } = require("util");
const query = promisify(connection.query).bind(connection);
const catchAsync = require("../utilities/catchAsync");
const appError = require("../utilities/appError");
const { addWhereCondition, filterObjTo } = require("../utilities/control");

exports.getMyReports = catchAsync(async (req, res, next) => {
  const { id, role } = req.auth;
  let data;
  if (role === "marketer")
    data = await query(`SELECT * FROM mar_rep_mar WHERE reporter_id="${id}"`);
  else if (role === "surfer")
    data = await query(
      ["mar", "post", "pro", "sur"].reduce(
        (prev, cur, i) =>
          `${prev}${
            i === 0 ? "" : " UNION"
          } SELECT * FROM sur_rep_${cur} WHERE reporter_id="${id}"`,
        ""
      )
    );
  res.json({
    status: "success",
    data,
  });
});
exports.getReportedReports = catchAsync(async (req, res, next) => {
  const { reported_id } = req.body;
  if (!reported_id) return next(new appError("reported id must be provided"));
  const table = reported_id.substr(0, 3);
  let data;
  if (table === "mar")
    data = await query(
      `SELECT * FROM mar_rep_mar WHERE reported_id="${reported_id}" 
        UNION 
        SELECT * FROM sur_rep_mar WHERE reported_id="${reported_id}"`
    );
  else
    data = await query(
      `SELECT * FROM sur_rep_${table} WHERE reported_id="${reported_id}"`
    );
  return res.json({
    status: "success",
    data,
  });
});
exports.getReportsForTables = catchAsync(async (req, res, next) => {
  const { reportOptions } = req.query;
  const fullNames = {
    mar: "marketer",
    sur: "surfer",
    pos: "post",
    pro: "product",
  };
  const data = await query(
    `select * from sur_rep_${reportOptions.substr(0, 3)}`
  );
  res.json({
    status: "success",
    data,
  });
});
exports.getMarketerReports = catchAsync(async (req, res, next) => {
  const data = await query(
    `select * from sur_rep_mar JOIN marketer ON mar_id = id`
  );
  res.json({
    status: "success",
    data,
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
exports.getPostReports = catchAsync(async (req, res, next) => {
  const q = await query(`select * from sur_rep_pos`);
  const reducedCondition = q
    .map(({ reported_id }) => reported_id)
    .reduce((prev, cur, i) => `${prev}${i == 0 ? "" : ","}"${cur}"`, "");
  const posts = await query(
    `select * from post where id IN (${reducedCondition})`
  );
  console.log(posts);
  const data = await detailedPosts(posts, undefined);
  res.json({
    status: "success",
    data,
  });
});

exports.getSurferReports = catchAsync(async (req, res, next) => {
  const data = await query(
    `select fname , lname , photo , reporter_id , reported_id , report_option from sur_rep_sur JOIN surfer ON reported_id = surfer.id`
  );
  res.json({
    status: "success",
    data,
  });
});
const detailedProducts = async (products, userId) => {
  if (products.length === 0) return [];
  let productsHashed = {};
  await Promise.all(
    products.map(async (product) => {
      const r = await Promise.all([
        query(
          `select fname , lname , photo from marketer where id="${product.marketer_id}"`
        ),
        query(
          `select COUNT(*) as reviews_counter , AVG(rating) as avg_rating from review where product_id="${product.id}"`
        ),
      ]);
      const [[marketer_info], [{ reviews_counter, avg_rating }]] = r;
      console.log(r);
      productsHashed[product.id] = {
        ...product,
        media: [],
        marketer_info,
        reviews_counter,
        avg_rating: avg_rating || 0,
      };
    })
  );
  // return res.json({ products, postsHashed });
  const reducedCondition = products.reduce(
    (prev, cur, index) =>
      `${prev} ${index == 0 ? "'" + cur.id + "'" : "," + "'" + cur.id + "'"}`,
    ""
  );
  const products_media = await query(
    `SELECT * FROM product_media WHERE product_id IN (${reducedCondition})`
  );
  products_media.forEach(({ product_id, link }) =>
    productsHashed[product_id].media.push(link)
  );
  return Object.values(productsHashed);
};
exports.getProductReports = catchAsync(async (req, res, next) => {
  const q = await query(`select * from sur_rep_pro`);
  const reducedCondition = q
    .map(({ reported_id }) => reported_id)
    .reduce((prev, cur, i) => `${prev}${i == 0 ? "" : ","}"${cur}"`, "");
  const products = await query(
    `select * from product where id IN (${reducedCondition})`
  );
  const data = await detailedProducts(products, undefined);
  res.json({
    status: "success",
    data,
  });
});
exports.makeReport = catchAsync(async (req, res, next) => {
  req.body.reporter_id = req.auth.id;
  const data = await query(
    `INSERT INTO ${req.body.reporter_id.substr(
      0,
      3
    )}_rep_${req.body.reported_id.substr(0, 3)} SET ?`,
    req.body
  );
  res.json({
    status: "success",
    data,
  });
});
exports.deleteReport = catchAsync(async (req, res, next) => {
  const { reporter_id, reported_id } = req.body;
  const data = await query(
    `DELETE FROM ${reporter_id.substr(0, 3)}_rep_${reported_id.substr(
      0,
      3
    )} WHERE reporter_id="${reporter_id}" AND reported_id="${reported_id}"`
  );
  res.json({
    status: "success",
    data,
  });
});
exports.deactivate = catchAsync(async (req, res, next) => {
  const { reported_id, reporter_id, removed } = req.body;
  const data = await query(
    `call deactivate_${reported_id.substr(
      0,
      3
    )}(${removed} , "${reporter_id}" , "${reported_id}")`
  );
  res.json({
    status: "success",
    data,
  });
});
