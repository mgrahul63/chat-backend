const ObjectById = (obj) => {
  const { _id, ...rest } = obj;
  return { id: _id, ...rest };
};

export default ObjectById;
