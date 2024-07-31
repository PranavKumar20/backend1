const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    console.log("passed via auth middleware");
    console.log(decoded);
    next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = {
  authMiddleware,
};
