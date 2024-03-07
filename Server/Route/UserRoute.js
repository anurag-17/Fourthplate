const express = require("express")

const { isAuthJWT, authorizeRoles } = require("../Utils/jwt")
const { addUser, loginUser, logoutUser, forgotPwd, resetPassword, deleteUser, updateUserPassword, updateUser, getUserById, getAllUsersWithPagination, userData } = require("../Controller/UserAuth")
const router = express.Router()

router.route("/add").post(addUser)
router.route("/login").post(loginUser)
router.route("/logout").get(isAuthJWT, authorizeRoles("User"), logoutUser)
router.route("/forgotPassword").post(forgotPwd)
router.route("/resetPassword").post(resetPassword)
router.route("/deletuser/:id").delete(isAuthJWT,deleteUser)
router.route("/updatePassword").put(isAuthJWT, authorizeRoles("User"),updateUserPassword)
router.route("/update/:id").put(isAuthJWT,updateUser)

router.route("userData").get(isAuthJWT,userData)

// router.route("/login").get(adminLogin)
// router.route("/updatePass").post(isAuthJWT,authorizeRoles("Admin"),updatePassword)
// router.route("/logout").get(isAuthJWT, authorizeRoles("Admin"), logout)
// router.route("/forgotPassword").post(forgotPwd)
// router.route("/resetPassword").post(resetPassword)
module.exports = router;