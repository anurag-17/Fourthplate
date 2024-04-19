const uploadOnS3 = require("../Utils/awsS3");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../Utils/jwt");
const User = require("../Model/User");
const sendEmail = require("../Utils/SendEmail");
const Admin = require("../Model/Admin");
const CsvParser = require("json2csv").Parser;
const SubAdmin = require("../Model/SubAdmin");

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

//for admin
exports.Create_SubAdminBy_Admin = async (req, res, next) => {

    const {email,password } = req.body;
  
    const existingUser = await SubAdmin.findOne({ email });
    if (existingUser) {
      return res.status(203).json({ success: false,message: "SubAdmin with this email already exists."});
    }
  
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const userData = {
      email,
      password:hashedPassword
    };
    try {
      const newUser = await SubAdmin.create(userData);
      // sendToken(newUser, 201, res);
      const mailOptions = {
        from: "app@fourthplate.com",
        to: email,
        subject: "Congratulations! Your Account is Successfully Created By Admin",
        text: `<h2>Hello Dear, </h2>
            <h3>Congratulations! Your Account successfully is Created for our service. Welcome!
            <h4>Your account email :- ${email},
            Your account password :- ${password},
            Click on this link for login :- ${'http://34.242.24.155:5000/'}<h3>
            </h4>
            <h3>Thanks and regards</h3>
            `,
      };
    
      try {
        const info = await sendEmail(mailOptions);
        console.log("Email sent:", info);
        return res.status(HttpStatus.OK).json({ success: true,message:"SubAdmin created successfully", data:newUser });
      } catch (error) {
        console.log("Error sending email:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send email" });
      }
  
    } catch (error) {
      next(error);
      res.status(500).json({ status:false,error: 'Internal server error' });
  
    }
  
  };


  exports.update_SubAdminBy_Admin = async (req, res) => {
    const { id } = req.params;
    let updateData = { ...req.body };
  
    // Remove the email and password fields from the updateData object if they exist
    if (updateData.email || updateData.password) {
      console.log("Email or password update request detected and ignored.");
      delete updateData.email;
      delete updateData.password;
    }
  
    // Handle contact field update logic
    if (
      "contact" in updateData &&
      updateData.contact !== "" &&
      updateData.contact !== null
    ) {
      // Check for duplicacy of contact value before updating
      const doesExist = await SubAdmin.findOne({
        contact: updateData.contact,
        _id: { $ne: id },
      });
      if (doesExist) {
        return res.status(400).json({
          success: false,
          message: "Contact already exists. Please use a different contact.",
        });
      }
    }
  
    // Define a function to update the user to avoid repetition
    const updateUserInDatabase = async () => {
      try {
        const updatedUser = await SubAdmin.findByIdAndUpdate(id, updateData, {
          new: true,
        });
  
        if (!updatedUser) {
          return res
            .status(404)
            .json({ success: false, message: "SubAdmin not found." });
        }
  
        // Return the updated user information
        return res.status(200).json({ success: true, message: " data updated successfully",data:updatedUser});
      } catch (error) {
        // Handle possible errors
        return res.status(500).json({
          success: false,
          message: "Server error occurred while updating the user.",
          error: error.message,
        });
      }
    };
    // Update user in the database
    return await updateUserInDatabase();
  };


  exports.delete_SubAdminBy_Admin = async (req, res) => {
    const { id } = req.params; // Assuming the user's ID is securely obtained from the authenticated session
  
    try {
      // Attempt to delete the user by ID
      const deletedUser = await SubAdmin.findByIdAndDelete(id);
  
      // Check if a user was found and deleted
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "SubAdmin not found.",
        });
      }
  
      // Respond to the client upon successful deletion
      return res.status(200).json({
        success: true,
        message: "SubAdmin deleted successfully.",
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
  

exports.getAll_SubAdmin = async (req, res) => {
    // Extract page and limit from query parameters, provide default values
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
  
    try {
      // Count the total number of users in the database
      const totalUsers = await SubAdmin.countDocuments();
  
      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);
  
      // Find users with limit, skip, and sort for pagination
      const users = await SubAdmin.find().skip(skip).limit(limit).sort({ _id: -1 });
  
      // Respond with users and pagination details
      return res.status(200).json({
        success: true,
        message: "get all subAdmin successfully.",
        count: users.length,
        page,
        totalPages,
        data: users,
      });
    } catch (error) {
      // Handle any errors that occur during fetching users
      return res.status(500).json({
        success: false,
        message: "Server error occurred while retrieving users.",
        error: error.message,
      });
    }
  };


  exports.get_SubAdminBy_Id = async (req, res) => {
    const { id } = req.params; // Assuming the user's ID is passed as a URL parameter
  
    try {
      // Attempt to find the user by ID
      const user = await SubAdmin.findById(id);
  
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
        message: "get data successfully.",
        data: user,
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


//for subadmin
exports.SubAdminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: StatusMessage.MISSING_EMAIL_PASSWORD,
        });
      }
  
      const admin = await SubAdmin.findOne({ email });
  
      if (!admin) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: StatusMessage.USER_NOT_FOUND });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
  
      if (isPasswordMatch) {
        const token = generateToken({ email: admin.email });
        await SubAdmin.findByIdAndUpdate(
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



  exports.SubAdmin_logout = async (req, res) => {
      try {
        const authHeader = req.headers.authorization;
        console.log("authHeader",authHeader);
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
        const userData = await SubAdmin.findOne({ email });
        console.log("userData",userData);
        if (userData.activeToken && userData.activeToken === token) {
          const user = await SubAdmin.findOneAndUpdate(
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


  // exports.verify_SubAdmin = async (req, res) => {
  //   const user = req.user;
  //   console.log("user",user);
  //   try {
  //       let loggedInUser;
        
  //       // Check if the user is a regular user
  //       loggedInUser = await SubAdmin.findById(user._id)
  //           .select("-password -activeToken")
  //           .populate({
  //               path: "eventJoined",
  //               populate: [
  //                   { path: "food", select: "-__v" },
  //                   { path: "ownerId", select: "-password -activeToken -__v" },
  //                 { path: "joinerId",select: "-__v" }
  //               ]
  //           });
  
  //       // If the user is not found among regular users, check if they are an admin
  //       if (!loggedInUser) {
  //           loggedInUser = await Admin.findById(user._id).select("-password -activeToken");
  //       }
  // console.log("loggedInUser",loggedInUser);
  //       // If the user or admin is found, send the response
  //       if (loggedInUser) {
  //           return res.status(HttpStatus.OK).json({
  //               success: true,
  //               data: loggedInUser,
  //               message: "Verification successful",
  //           });
  //       } else {
  //           // If neither regular user nor admin is found, return appropriate message
  //           return res.status(HttpStatus.NOT_FOUND).json({
  //               success: false,
  //               message: "User not found",
  //           });
  //       }
  //   } catch (error) {
  //       console.log(error);
  //       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //           success: false,
  //           error: StatusMessage.SERVER_ERROR,
  //       });
  //   }
  // };


  exports.getAllUsersWithPagination = async (req, res) => {
    // Extract page and limit from query parameters, provide default values
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
  
    try {
      // Count the total number of users in the database
      const totalUsers = await User.countDocuments();
  
      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);
  
      // Find users with limit, skip, and sort for pagination
      const users = await User.find().skip(skip).limit(limit).sort({ _id: -1 });
  
      // Respond with users and pagination details
      return res.status(200).json({
        success: true,
        count: users.length,
        page,
        totalPages,
        data: users,
      });
    } catch (error) {
      // Handle any errors that occur during fetching users
      return res.status(500).json({
        success: false,
        message: "Server error occurred while retrieving users.",
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

  exports.updateUserBySubAdmin = async (req, res) => {
    const { id } = req.params;
    let updateData = { ...req.body };
  
    // Remove the email and password fields from the updateData object if they exist
    if (updateData.email || updateData.password) {
      console.log("Email or password update request detected and ignored.");
      delete updateData.email;
      delete updateData.password;
    }
  
    // Handle contact field update logic
    if (
      "contact" in updateData &&
      updateData.contact !== "" &&
      updateData.contact !== null
    ) {
      // Check for duplicacy of contact value before updating
      const doesExist = await User.findOne({
        contact: updateData.contact,
        _id: { $ne: id },
      });
      if (doesExist) {
        return res.status(400).json({
          success: false,
          message: "Contact already exists. Please use a different contact.",
        });
      }
    }
  
    // Define a function to update the user to avoid repetition
    const updateUserInDatabase = async () => {
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
    // Update user in the database
    return await updateUserInDatabase();
  };
  
  
  exports.deleteUserBySubAdmin = async (req, res) => {
    const { id } = req.params; // Assuming the user's ID is securely obtained from the authenticated session
  
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
  exports.Create_UserBy_SubAdmin = async (req, res, next) => {

    const {email,password } = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(203).json({ success: false,message: "User with this email already exists." });
    }
  
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const userData = {
      email,
      password:hashedPassword
    };
    try {
      const newUser = await User.create(userData);
      // sendToken(newUser, 201, res);
      const mailOptions = {
        from: "app@fourthplate.com",
        to: email,
        subject: "Congratulations! Your Account is Successfully Created  By Admin",
        text: `<h2>Hello Dear, </h2>
            <h3>Congratulations! Your Account successfully is Created for our service. Welcome!
            Your account email :- ${email},
            Your account password :- ${password},
            </h3>
            <h3>Thanks and regards</h3>
            `,
      };
    
      try {
        const info = await sendEmail(mailOptions);
        console.log("Email sent:", info);
        return res.status(HttpStatus.OK).json({ success: true,message:"user created successfully", data:newUser });
      } catch (error) {
        console.log("Error sending email:", error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send email" });
      }
  
  
    } catch (error) {
      next(error);
      res.status(500).json({ status:false,error: 'Internal server error' });
  
    }
  
  
  };