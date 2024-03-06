const uploadOnS3 = require("../Utils/awsS3");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../Utils/jwt");
const User = require("../Model/User");
const sendEmail = require("../Utils/SendEmail");
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

exports.uploadImage = async (req, res, next) => {
  // console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let fileName = req.file.originalname;

    let url = await uploadOnS3(req.file.buffer, fileName); // Assuming req.file.buffer contains the image buffer
    console.log("URL:", url);
    return res.status(200).json({ status: true, url: url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, contact,age, picture, gender } = req.body;

    if (!name || !email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.MISSING_DATA });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isDuplicate = await User.find({ email });
    //   console.log(isDuplicate);
    if (isDuplicate.length > 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.DUPLICATE_EMAIL });
    }

    const userData = new User({
      name,
      email,
      contact,
      password: hashedPassword,
      age,
      picture,
      gender,
    });

    const result = await userData.save();

    //   console.log(result); // Log the result for debugging, avoid exposing in production

    return res.status(HttpStatus.OK).json({ success: true, message: result });
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
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.contact === 1
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.DUPLICATE_CONTACT });
    }
    return res
      .status(HttpStatus.SERVER_ERROR)
      .json({ success: false, message: StatusMessage.SERVER_ERROR });
  }
};
exports.updateUser = async (req, res) => {
  const id = req.params; // Assuming the user's ID is passed as a URL parameter
  let updateData = req.body; // The updated information is expected to be in the request body

  // Remove the email field from the updateData object if it exists
  if (updateData.email) {
    console.log("Email update request detected and ignored.");
    delete updateData.email;
    delete updateData.password;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Return the updated user information
    return res.status(200).json({ success: true, message: updatedUser });
  } catch (error) {
    // Handle possible errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while updating the user.",
      error: error.message,
    });
  }
};
exports.updateUserPassword = async (req, res) => {
  const id = req.user._id; // The user's ID, assuming it's available from the authenticated user session
  const { oldPassword, newPassword } = req.body; // Client must send old and new passwords

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide both old and new password.",
    });
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Compare oldPassword with the user's current password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password with the new hashed password
    user.password = hashedPassword;
    await user.save();

    // Return success message
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    // Handle possible errors
    return res.status(500).json({
      success: false,
      message: "Server error occurred while updating the password.",
      error: error.message,
    });
  }
};
exports.forgotPwd = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ success: false, message: StatusMessage.INVALID_EMAIL_PASSWORD });
  }
  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ success: false, message: StatusMessage.USER_NOT_FOUND });
  }
  // console.log(user);
  const token = generateToken({ email: user.email });
  user.resetToken = token;
  await user.save();
  const mailOptions = {
    from: "akash.hardia@gmail.com",
    to: user.email,
    subject: "Reset Password Link",
    text: `<h2>Hello! ${user.name} </h2>
        <h3>Please follow the link to reset your password: <a href=http//:localhost:3000/${token}>Link</a></h3>
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
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      token = authHeader;
    }
    const tokenUser = await verifyToken(token); // Assuming you have the user's ID from the session or token
    const { newPassword } = req.body;

    if (!newPassword) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.MISSING_DATA });
    }
    // console.log(userId);
    const user = await User.findOne({ email: tokenUser.email });
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ success: false, message: StatusMessage.USER_NOT_FOUND });
    }

    if (user.resetToken !== token) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ success: false, message: StatusMessage.USER_NOT_FOUND });
    }
    // Verify the current password

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = "";
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
// Delete user controller
exports.deleteUser = async (req, res) => {
  const {id} = req.params; // Assuming the user's ID is securely obtained from the authenticated session

  try {
    // Attempt to delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if a user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond to the client upon successful deletion
    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    // Handle possible errors during the deletion process
    return res.status(500).json({
      success: false,
      message: "Server error occurred while deleting the user.",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params; // Assuming the user's ID is passed as a URL parameter

  try {
    // Attempt to find the user by ID
    const user = await User.findById(id);

    // If no user is found, return a 404 error
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken({ email: user.email });
    await User.findByIdAndUpdate(
      { _id: user._id?.toString() },
      { activeToken: token },
      { new: true }
    );
    // Respond with token
    return res.status(200).json({
      success: true,
      token,
      message: `Welcome ${user.name}`,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred",
      error: error.message,
    });
  }
};
exports.logoutUser = async (req, res) => {
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
    const userData = await User.findOne({ email });
    if (userData.activeToken && userData.activeToken === token) {
      const user = await User.findOneAndUpdate(
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
exports.getAllUsersWithPagination = async (req, res) => {
  // Extract page and limit from query parameters, provide default values
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
      // Count the total number of users in the database
      const totalUsers = await User.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);

      // Find users with limit and skip for pagination
      const users = await User.find().skip(skip).limit(limit);

      // Respond with users and pagination details
      return res.status(200).json({
          success: true,
          count: users.length,
          page,
          totalPages,
          data: users
      });
  } catch (error) {
      // Handle any errors that occur during fetching users
      return res.status(500).json({
          success: false,
          message: "Server error occurred while retrieving users.",
          error: error.message
      });
  }
};