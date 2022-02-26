exports.paginate = (query, page, limit) => {
  page = +page || 1;
  limit = +limit || 100;
  const skip = (page - 1) * (limit || 100);
  const newQuery = `${query} LIMIT ${limit} OFFSET ${skip}`;
  console.log(newQuery);
  return newQuery;
};
