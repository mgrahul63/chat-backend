const ArrayObjectById = (arr) => {
  return arr?.map((obj) => {
    const { _id, ...rest } = obj;
    return { id: _id, ...rest };
  });
};

export default ArrayObjectById;
