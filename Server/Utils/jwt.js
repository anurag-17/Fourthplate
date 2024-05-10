const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const Admin = require("../Model/Admin");
const SubAdmin = require("../Model/SubAdmin");

exports.generateToken = (payload, expiresIn = "365d") => {
  console.log(payload);
  return jwt.sign(payload, process.env.jwtKey, { expiresIn });
};
exports.generateTokenForPwd = (payload, expiresIn = "5m") => {
  console.log(payload);
  return jwt.sign(payload, process.env.jwtKey, { expiresIn });
};
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.jwtKey);
    return decoded;
  } catch (error) {
    // Handle invalid/expired tokens here
    console.log(error);
    return null;
  }
};

exports.isAuthJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = authHeader;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  try {
    const decodedData = jwt.verify(token, process.env.jwtKey);
  // console.log(decodedData);
    req.user = await User.findOne({ email: decodedData?.email });

    // console.log("sasaa",req.user);
    if (!req.user) {
      console.log("wwww");
      req.user = await Admin.find({ email: decodedData?.email });
      console.log("req.user",req.user);
      // req.user = await SubAdmin.findOne({ email: decodedData?.email });
    }
    if (!req.user) {
      console.log("wwrrww");
      req.user = await SubAdmin.findOne({ email: decodedData?.email });
    }
console.log("token",token);
// console.log("req.user.activeToken ",req.user[0].activeToken );


    if (req.user.activeToken || req.user[0].activeToken === token) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please login again" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, please login again" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else {
      console.error("Other error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

// auth role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      console.log("roles.includes(req.user[0].role)",roles.includes(req.user.role));
      console.log("req.user[0].role",req.user[0].role);
      return next(
        res.status(403).json({
          success: false,
          message: `Role: ${req.user.role} is not allowed  to access this resource`,
        })
      );
    }
    next();
  };
};
