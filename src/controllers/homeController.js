export const home = (req, res) => {
  return res.json({ message: 'Welcome to Express Starter!' });
};

export const whoamI = (req, res) => {
  return res.json({ userDetails: req.userDetails });
};
