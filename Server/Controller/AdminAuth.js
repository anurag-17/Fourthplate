const bcrypt = require("bcrypt");
const {
  generateToken,
  verifyToken,
  generateTokenForPwd,
} = require("../Utils/jwt");
const Admin = require("../Model/Admin");
const User = require("../Model/User");
const Event = require("../Model/Event");
const sendEmail = require("../Utils/SendEmail");
const jwt = require("jsonwebtoken");
const HttpStatus = {
  OK: 200,
  INVALID: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
};
const StatusMessage = {
  INVALID_CREDENTIALS: "Invalid credentials.",
  INVALID_EMAIL_PASSWORD: "Please provide email and password.",
  USER_NOT_FOUND: "User not found.",
  SERVER_ERROR: "Server error.",
  MISSING_DATA: "Please provide all necessary user details.",
  DUPLICATE_DATA: "Data already exists.",
  DUPLICATE_EMAIL: "Email already exists.",
  DUPLICATE_CONTACT: "Contact number already exists.",
  USER_DELETED: "Deleted successfully.",
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
  USER_UPDATED: "User updated successfully.",
  MISSING_PAGE_PARAMS: "Please provide page number and limit.",
  SAVED_SUCC: "Saved Successfully!",
  NOT_FOUND: "Data not found.",
};

exports.addAdmin = async (req, res) => {
  try {
    const { email, fullname, password } = req.body;

    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(StatusMessage.MISSING_DATA);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = new Admin({ email, password: hashedPassword, fullname });

    const result = await adminData.save();

    // console.log(result); // Log the result for debugging, avoid exposing in production

    return res.status(HttpStatus.OK).json({ success: true, result });
  } catch (error) {
    console.error(error); // Log the error for debugging, avoid exposing in production

    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.DUPLICATE_EMAIL });
    }

    return res
      .status(HttpStatus.SERVER_ERROR)
      .json({ success: false, message: StatusMessage.SERVER_ERROR });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: StatusMessage.MISSING_EMAIL_PASSWORD,
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: StatusMessage.USER_NOT_FOUND });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (isPasswordMatch) {
      const token = generateToken({ email: admin.email });
      await Admin.findByIdAndUpdate(
        { _id: admin._id?.toString() },
        { activeToken: token },
        { new: true }
      );

      return res.status(HttpStatus.OK).json({
        message: `Welcome ${admin.email}`,
        data: admin,
        token: token,
        success: true,
      });
    } else {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: StatusMessage.INVALID_CREDENTIALS });
    }
  } catch (error) {
    return res
      .status(HttpStatus.SERVER_ERROR)
      .json({ success: false, message: StatusMessage.SERVER_ERROR });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      token = authHeader;
    }
    const email = req.user.email;
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Invalid session or token, please login again",
      });
    }
    const userData = await Admin.findOne({ email });
    if (userData.activeToken && userData.activeToken === token) {
      const user = await Admin.findOneAndUpdate(
        { email: email, activeToken: token },
        { $unset: { activeToken: "" } }, // Unset the token
        { new: true }
      );
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid session or token, please login again",
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        message: `${userData.email} is Logout Successfully`,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
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

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have the user's ID from the session or token
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.MISSING_DATA });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ success: false, message: StatusMessage.USER_NOT_FOUND });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: StatusMessage.PASSWORD_INCORRECT });
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Optionally, send an email to the user acknowledging the password change

    return res
      .status(HttpStatus.OK)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.SERVER_ERROR)
      .json({ success: false, message: StatusMessage.SERVER_ERROR });
  }
};
exports.forgotPwd = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ success: false, message: StatusMessage.INVALID_EMAIL_PASSWORD });
  }
  let user = await Admin.findOne({ email });
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ success: false, message: StatusMessage.USER_NOT_FOUND });
  }
  // console.log(user);
  const token = generateTokenForPwd({ email: user.email });
  user.resetToken = token;
  await user.save();
  const mailOptions = {
    from: "akash.hardia@gmail.com",
    to: user.email,
    subject: "Reset Password Link",
    text: `<h2>Hello Admin, </h2>
      <h3>Please follow the link to reset your password: <a href=http://34.242.24.155:5000/reset-password/${token}>Link</a></h3>
      <h3>Thanks and regards</h3>
      `,
  };

  try {
    const info = await sendEmail(mailOptions);
    console.log("Email sent:", info);
    return res
      .status(200)
      .json({ success: true, message: "Reset link sent to registered mail." });
  } catch (error) {
    console.log("Error sending email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send email" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let token;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Invalid or missing authorization token" });
    }

    token = authHeader.slice(7); // Extract token without 'Bearer ' prefix

    // Verify token and extract user information
    const tokenUser = await verifyToken(token);
    if (!tokenUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: "Missing password" });
    }

    // First try to find the user in the Admin collection
    let user = await Admin.findOne({ email: tokenUser.email, resetToken: token });
    if (!user) {
      // If not found in Admin, then try to find in the User collection
      user = await User.findOne({ email: tokenUser.email, resetToken: token });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    }

    if (user.resetToken !== token) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = ""; // Clear the reset token
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error); // Keep detailed errors server-side for security
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};
exports.getAdminById = async (req, res) => {
  const id = req.user._id;

  try {
    const user = await Admin.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond with the found user
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    // Handle any errors, such as invalid ID format
    return res.status(500).json({
      success: false,
      message: "Server error occurred while retrieving the user.",
      error: error.message,
    });
  }
};
exports.counts = async (req, res) => {
  try {
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();
    res.json({ eventCount, userCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


