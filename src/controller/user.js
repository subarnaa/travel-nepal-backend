
export const getUser = async (req, res) => {
  const { user } = req;
  res.send(user);
};
