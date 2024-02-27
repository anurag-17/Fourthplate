const express = require("express")
const { addAdmin, adminLogin, updatePassword, logout, forgotPwd, resetPassword } = require("../Controller/AdminAuth")
const { isAuthJWT, authorizeRoles } = require("../Utils/jwt")
const router = express.Router()

router.route("/addAdmin").post(addAdmin)
router.route("/login").get(adminLogin)
router.route("/updatePass").post(isAuthJWT,authorizeRoles("Admin"),updatePassword)
router.route("/logout").get(isAuthJWT, authorizeRoles("Admin"), logout)
router.route("/forgotPassword").post(forgotPwd)
router.route("/resetPassword").post(resetPassword)
module.exports = router;