const { promisify } = require("util");
const connection = require("../connection");
const catchAsync = require("../utilities/catchAsync");
const query = promisify(connection.query).bind(connection);
const columns = require("../utilities/tableColumns");
const {
  addWhereCondition,
  filterObjFrom,
  filterObjTo,
  uniqueIdGenerator,
} = require("./../utilities/control");
//////////// utilities functions //////////////////

////////////////////////////////////////////
///////////// global routes ////////////////
// SELECT * FROM ((table)) WHERE ((get conditions from req.body))
//
exports.select = (table) =>
  catchAsync(async (req, res, next) => {
    // req.body = filterObjTo(req.body, columns[table]);
    const data = await query(
      addWhereCondition(`SELECT * FROM \`${table}\``, req.body)
    );
    res.json({
      status: "success",
      data: data.map((el) => ({
        ...el,
        password: undefined,
        passwordChangedAt: undefined,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      })),
    });
  });
// INSERT INTO TABLE SET ? ==> get values from filtered req.body
// filter from id if it doesn't have unique id
// id is the 0 index of the table columns
exports.create = (table, filter = [], createUnique = true) =>
  catchAsync(async (req, res, next) => {
    // return console.log(req.body);
    // req.body = filterObjTo(req.body, columns[table]);
    req.body = filterObjFrom(req.body, filter);
    let id;
    createUnique &&
      (id = req.body[columns[table][0]] = uniqueIdGenerator(table));
    if (Object.keys(req.body).length === 0)
      return res.json({
        status: "fail",
        err: "leak of data",
      });
    const data = await query(`INSERT INTO \`${table}\` SET ?`, req.body);
    res.json({
      status: "success",
      data,
    });
  });
// permanently delete be careful
exports.delete = (table) =>
  catchAsync(async (req, res, next) => {
    // req.body = filterObjTo(req.body, columns[table]);
    const data = await query(
      addWhereCondition(`DELETE FROM \`${table}\``, req.body)
    );
    res.json({
      status: "success",
      data,
      // id,
    });
  });

// update table set ? ==> search from req.body and update from filtered req.body
exports.update = (table, filter = []) =>
  catchAsync(async (req, res, next) => {
    // req.body = filterObjTo(req.body, columns[table]);
    const idKey = columns[table][0];
    const data = query(
      `UPDATE \`${table}\` SET ? WHERE ${idKey}="${req.body[idKey]}"`,
      filterObjFrom(req.body, filter)
    );
    res.json({
      status: "success",
      data,
    });
  });
exports.updateNonPrimary = (
  table,
  searchAttributes = [],
  filterAttributes = []
) =>
  catchAsync(async (req, res, next) => {
    // req.body = filterObjTo(req.body, columns[table]);
    const updated = await query(
      addWhereCondition(
        `UPDATE \`${table}\` SET ?`,
        // req.body
        filterObjTo(req.body, filterAttributes)
      ),
      filterObjTo(req.body, searchAttributes)
    );
    res.json({
      status: "success",
      data: req.body,
    });
  });
exports.globalQuery = (queryStr) =>
  catchAsync(async (req, res, next) => {
    const data = await query(queryStr);
    return res.json({
      status: "success",
      data,
    });
  });

// query => the main query
// whereCondition
//////////////////////////////////////////////////////

// req.body
