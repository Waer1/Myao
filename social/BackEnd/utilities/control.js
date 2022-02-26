exports.uniqueIdGenerator = (table = "") =>
  `${table.substring(0, 3)}${Date.now()
    .toString(36)
    .substring(0, 7)}${Math.floor(Math.random() * 1295).toString(36)}`;
exports.addWhereCondition = (query, Obj) =>
  Object.keys(Obj).reduce(
    (prev, cur, i) =>
      `${prev} ${i == 0 ? "WHERE" : "AND"} ${cur}="${Obj[cur]}"`,
    query
  );

exports.filterObjFrom = (Obj, fil = []) => {
  let newObj = { ...Obj };
  fil.forEach((val) => delete newObj[val]);
  return newObj;
};
// TODO:
// make it work for capital and small letters
exports.filterObjTo = (Obj, fil = []) => {
  let newObj = {};
  fil.forEach((val) => {
    if (val in Obj) newObj[val] = Obj[val];
  });
  return newObj;
};

exports.convertAuthTo = (authTo) => (req, res, next) => {
  req.body[authTo] = req.auth?.id;
  next();
};
