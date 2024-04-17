const express = require("express")
const { addAdmin, adminLogin, updatePassword, logout, forgotPwd, resetPassword, getAdminById, counts } = require("../Controller/AdminAuth")
const { isAuthJWT, authorizeRoles } = require("../Utils/jwt")
const { getUserById, getAllUsersWithPagination ,Create_UserBy_Admin,updateUserByAdmin,deleteUserByAdmin} = require("../Controller/UserAuth")
const router = express.Router()

router.route("/addAdmin").post(addAdmin)
router.route("/login").post(adminLogin)
router.route("/updatePass").post(isAuthJWT,authorizeRoles("Admin"),updatePassword)
router.route("/logout").get(isAuthJWT, authorizeRoles("Admin"), logout)
router.route("/forgotPassword").post(forgotPwd)
router.route("/resetPassword").post(resetPassword)

router.route("/Create_UserBy_Admin").post(isAuthJWT, authorizeRoles("Admin"),Create_UserBy_Admin)
router.route("/update/:id").put(isAuthJWT,authorizeRoles("Admin"),updateUserByAdmin)
router.route("/deletuser/:id").delete(isAuthJWT,authorizeRoles("Admin"),deleteUserByAdmin)
router.route("/getauser/:id").get(isAuthJWT, authorizeRoles("Admin"),getUserById)
router.route("/getalluser").get(isAuthJWT, authorizeRoles("Admin"),getAllUsersWithPagination)


router.route("/getAdminById").get(isAuthJWT, authorizeRoles("Admin"),getAdminById)
router.route("/counts").get(counts)

module.exports = router;