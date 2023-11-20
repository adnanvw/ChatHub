const jwt = require("jsonwebtoken");
//update
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "ChatHub");
    req.user = decodedToken.userId
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { auth };