const express = require("express")
const { addAdmin, adminLogin, updatePassword, logout, forgotPwd, resetPassword } = require("../Controller/AdminAuth")
const { isAuthJWT, authorizeRoles } = require("../Utils/jwt")
const { getUserById, getAllUsersWithPagination } = require("../Controller/UserAuth")
const router = express.Router()

router.route("/addAdmin").post(addAdmin)
router.route("/login").post(adminLogin)
router.route("/updatePass").post(isAuthJWT,authorizeRoles("Admin"),updatePassword)
router.route("/logout").get(isAuthJWT, authorizeRoles("Admin"), logout)
router.route("/forgotPassword").post(forgotPwd)
router.route("/resetPassword").post(resetPassword)

router.route("/getauser/:id").get(isAuthJWT, authorizeRoles("Admin"),getUserById)
router.route("/getalluser").get(isAuthJWT, authorizeRoles("Admin"),getAllUsersWithPagination)
module.exports = router;