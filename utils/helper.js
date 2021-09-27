const getSortFilter = (sortby) => {
  const sortFilter = [];
  if (sortby) {
    for (const prop in sortby) {
      if (sortby[prop] === "ascending") {
        sortFilter.push([prop, "ASC"]);
      } else if (sortby[prop] === "descending") {
        const filter = [prop, "DESC"];
        sortFilter.push(filter);
      }
    }
  }
  return sortFilter;
};

module.exports = {
  getSortFilter,
};
