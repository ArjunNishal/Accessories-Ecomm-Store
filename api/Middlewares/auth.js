const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token,"token auth page");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Access token is missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded.id;
    req.detail = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Access token is missing or invalid" });
  }
};

module.exports = authenticate;
