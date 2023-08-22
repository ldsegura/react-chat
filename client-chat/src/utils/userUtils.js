const generedChatPrivateIndex = (from, to) => {
  const index =
  from.id < to.id
      ? `${from.id}-${to.id}`
      : `${to.id}-${from.id}`;
  return index;
};

const userUtils = {
    generedChatPrivateIndex
};

export default userUtils;
