const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      return res.status(401).json({ message: "Invalid user !" });

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer")
      return res.status(401).json({ message: "Invalid user !" });

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid request" });
  }
};

module.exports = AuthMiddleware;
