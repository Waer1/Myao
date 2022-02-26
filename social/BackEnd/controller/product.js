const { paginate } = require("../utilities/postUtilities");
const { promisify } = require("util");
const unlink = promisify(require("fs").unlink);
const connection = require("../connection");
const appError = require("../utilities/appError");
const query = promisify(connection.query).bind(connection);
const controller = require("./globalController");
const catchAsync = require("../utilities/catchAsync");
const APIFeatures = require("../utilities/apiFeatures");
const {
  addWhereCondition,
  filterObjFrom,
  filterObjTo,
  uniqueIdGenerator,
} = require("./../utilities/control");
const columns = require("../utilities/tableColumns.js");
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await query(`SELECT * FROM product WHERE id=${req.body.id}`);
  if (!product) return next(new appError("no product with this id"));
  product.media = (
    await query(`SELECT * FROM product_media WHERE product_id=${product.id}`)
  ).map((media) => media.link);
  return res.json({
    status: "success",
    data: product,
  });
});

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
      const fileName = `product-img-${i}-${req.auth.id}-${Date.now()}.jpeg`;
      await sharp(buffer)
        .resize(1000, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`../frontend/public/img/products/${fileName}`);
      req.body.media.push({ link: `/img/products/${fileName}`, type: 0 });
    })
  );
  next();
});
const getMarketerProducts = async (
  userId,
  additionalJoin = "",
  additionalCondition = "",
  queryObj
) => {
  const { page, limit } = queryObj;
  const [products, reviews_info, products_media] = await Promise.all([
    query(
      paginate(
        `
   select product.id as product_id , product.marketer_id as marketer_id ,
  product_text , product.created_date as created_date ,
  reviews_counter , avg_rating , product_name , price , fname , lname , photo
  from product JOIN marketer
  ON marketer.id = product.marketer_id
  ${additionalJoin}
  ${additionalCondition === "" ? "" : "where " + additionalCondition}
  `,
        page,
        limit
      )
    ),
    query(
      `select COUNT(*) as review_counter , avg(rating) as avg_rating , product.id as product_id
      from product JOIN review 
      ON product.id = review.product_id 
      ${additionalJoin}
      ${additionalCondition === "" ? "" : "where " + additionalCondition}
      group by product.id`
    ),
    query(
      `select product.id as product_id , link 
      from product JOIN product_media 
      ON product_media.product_id = product.id 
      ${additionalJoin}
      ${additionalCondition === "" ? "" : "where " + additionalCondition}
      `
    ),
  ]);
  let productHashed = {};
  products.forEach((product) => {
    const { fname, lname, photo, marketer_id, product_id } = product;
    productHashed[product_id] = {
      ...product,
      marketer_info: {
        fname,
        lname,
        photo,
        marketer_id,
      },
      media: [],
    };
  });
  reviews_info.forEach(({ reviews_counter, avg_rating, product_id }) => {
    if (productHashed.hasOwnProperty(product_id)) {
      productHashed[product_id].reviews_counter = reviews_counter;
      productHashed[product_id].avg_rating = avg_rating;
    }
  });
  products_media.forEach(({ link, product_id }) => {
    if (productHashed.hasOwnProperty(product_id))
      productHashed[product_id].media.push(link);
  });
  return Object.values(productHashed);
};

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
exports.marketer_get_p = getMarketerProducts;
exports.getAllProducts = catchAsync(async (req, res, next) => {
  if (req.body.marketer_id) req.query.marketer_id = req.body.marketer_id;
  const queryStr = new APIFeatures("product", req.query)
    .filter()
    .sort()
    .paginate().query;
  const products = await query(queryStr);
  if (products.length === 0)
    return res.json({
      status: "success",
      data: products,
    });
  let productsHashed = {};
  products.forEach((product) => {
    productsHashed[product.id] = { ...product, media: [] };
  });
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
  res.json({
    status: "success",
    data: Object.values(productsHashed),
  });
});
exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const products = await query(
    `select * from product where id = "${req.params.id}"`
  );
  const data = await detailedProducts(products, req.auth.id);
  res.json({
    status: "success",
    data,
  });
});
exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const data = await getMarketerProducts(
    req.auth?.id,
    "",
    `product.id = "${req.body.id}"`,
    req.query
  );
  res.json({
    status: "success",
    data,
  });
});
exports.getMyProducts = catchAsync(async (req, res, next) => {
  req.query.marketer_id = req.auth?.id;
  if (!req.query.marketer_id) return next(new appError("unexpected error"));
  const queryStr = new APIFeatures("product", req.query)
    .filter()
    .sort()
    .paginate().query;
  const products = await query(queryStr);
  const data = await detailedProducts(products, req.auth.id);
  res.json({
    status: "success",
    data,
  });
});
exports.getMyProducts = catchAsync(async (req, res, next) => {
  const data = await getMarketerProducts(
    req.auth?.id,
    "",
    `product.marketer_id = "${req.auth.id}"`,
    req.query
  );
  res.json({
    status: "success",
    data,
  });
});
exports.getUserProducts = catchAsync(async (req, res, next) => {
  if (req.body.marketer_id) req.query.marketer_id = req.body.marketer_id;
  else return next(new appError("marketer_id must be given"));
  const queryStr = new APIFeatures("product", req.query)
    .filter()
    .sort()
    .paginate().query;
  const products = await query(queryStr);
  const data = await detailedPosts(products, req.auth?.id);
  res.json({
    status: "success",
    data,
  });
});
exports.getUserProducts = catchAsync(async (req, res, next) => {
  const data = await getMarketerProducts(
    req.auth?.id,
    "",
    `product.marketer_id = "${req.body.marketer_id}"`,
    req.query
  );
  res.json({
    status: "success",
    data,
  });
});
exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await query(
    addWhereCondition(
      `SELECT * FROM product`,
      // filterObjTo(req.body, columns["product"])
      req.body
    )
  );
  if (products.length === 0)
    return res.json({
      status: "success",
      data: products,
    });
  let productsHashed = {};
  products.forEach((product) => {
    productsHashed[product.id] = { ...product, media: [] };
  });
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
  res.json({
    status: "success",
    data: Object.values(productsHashed),
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { media } = req.body;
  try {
    const id = uniqueIdGenerator("product");
    if (req.auth.id) req.body.marketer_id = req.auth.id;
    req.body["id"] = id;
    req.body["avg_rating"] = 0;
    delete req.body.media;
    const product = await query(
      `INSERT INTO product set ? `,
      // filterObjTo(req.body, columns["product"])
      req.body
    );
    if (!media?.length)
      return res.json({
        status: "success",
        data: product,
      });
    const productMedia = media.map(({ link, type }) => [
      uniqueIdGenerator("PrMe"),
      type,
      id,
      link,
    ]);
    console.log(media);
    const product_media = await query(
      "INSERT INTO product_media (id , type , product_id , link) VALUES ?",
      [productMedia]
    );
    return res.json({ status: "success", data: { product, product_media } });
  } catch (err) {
    media?.length &&
      (await Promise.all(
        media.map(({ link }) => unlink(`../FrontEnd/public${link}`))
      ));
    throw err;
  }
});
exports.deleteProduct = controller.delete("product");
exports.updateProduct = catchAsync(async (req, res, next) => {
  //filterObjTo
  const Obj = filterObjFrom(req.body, [
    "id",
    "created_date",
    "marketer_id",
    "avg_rating",
    "reviews_counter",
    "media",
  ]);
  if (Object.keys(Obj).length === 0)
    return res.json({
      status: "fail",
      err: "no data to be changed",
    });
  const product = await query(
    `UPDATE product SET ? WHERE id='${req.body.id}'`,
    Obj
  );

  if (product.affectedRows === 0)
    return res.json({
      status: "fail",
      err: "wrong product id",
    });
  res.json({
    status: "success",
    data: product,
  });
});

exports.addNewReview = catchAsync(async (req, body, next) => {
  if (!req.body.rating || !req.body.product_id) return next();
  if (req.body.rating < 1 || req.body.rating > 5)
    return next(new appError("invalid rating value"));
  // const updatedQuery = await query(
  //   `INSERT INTO product(id ,marketer_id ,product_text ,avg_rating ,price ,created_date ,reviews_counter ,product_name)
  //    VALUES('${req.body.product_id}' ,'' ,1,1,'2020-12-12',0,'')
  //    ON DUPLICATE KEY UPDATE avg_rating=(avg_rating * reviews_counter + ${req.body.rating}) / (reviews_counter + 1)
  //   `
  // );
  const { reviews_counter, avg_rating } = await query(
    `SELECT avg_rating , reviews_counter FROM product WHERE id=${req.body.product_id}`
  );
  const updatedQuery = await query(
    `UPDATE product SET avg_rating=${
      (avg_rating * reviews_counter + req.body.rating) / (reviews_counter + 1)
    } , reviews_counter=${reviews_counter + 1}`
  );
  next();
});
