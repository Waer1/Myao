const columns = require("./tableColumns");
const { filterObjFrom } = require("./control");
class APIFeatures {
  constructor(table, options) {
    this.table = table;
    this.query = "";
    this.options = options;
    // this.options = options;
    this.comparisonOperators = {
      gt: ">",
      gte: ">=",
      lt: "<",
      lte: "<=",
      eq: "=",
      neq: "<>",
    };
  }
  filter() {
    let queryObj = { ...this.options };
    const excludedFields = ["page", "sort", "limit", "fields"];
    const { fields } = queryObj;
    queryObj = filterObjFrom(queryObj, excludedFields);
    // const hasWhere = this.query.toLowerCase().includes("where");
    this.query = Object.entries(queryObj)
      .map(([key, val]) => {
        if (typeof val === "object" && val !== null) {
          const operator = Object.keys(val)[0];
          return `${key}${this.comparisonOperators[operator]}"${val[operator]}" `;
        } else {
          return `${key}="${val}"`;
        }
      })
      .reduce(
        (prev, cur, i) => `${prev} ${i === 0 ? "WHERE" : "AND"} ${cur}`,
        `SELECT ${fields || "*"} FROM ${this.table}`
      );
    return this;
  }
  sort() {
    let { sort: order } = this.options;
    if (!order) return this;
    order = order
      .split(",")
      .map((val) =>
        val.startsWith("-") ? `${val.substring(1)} DESC` : `${val} ASC`
      )
      .toString();
    this.query = `${this.query} ORDER BY ${order}`;
    return this;
  }
  paginate() {
    const page = +this.options.page || 1;
    const limit = +this.options.limit || 100;
    const skip = (page - 1) * limit;
    this.query = `${this.query} LIMIT ${limit} OFFSET ${skip}`;
    console.log(this.query);
    return this;
  }
}
module.exports = APIFeatures;
