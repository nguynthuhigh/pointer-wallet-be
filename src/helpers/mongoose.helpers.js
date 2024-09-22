module.exports = {
  getRange: (start, end) => {
    return !start || !end
      ? undefined
      : { $gte: new Date(start), $lt: new Date(end) };
  },
  toBoolean: (active) => {
    if (active === "true") {
      return true;
    } else if (active === "false") {
      return false;
    }
    return undefined;
  },
  sortBy: (key) => {
    return key === "desc" ? -1 : 1;
  },
};
