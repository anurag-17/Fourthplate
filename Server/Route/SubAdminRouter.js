const express = require("express")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { isAuthJWT, authorizeRoles } = require("../Utils/jwt")
const { SubAdminLogin,SubAdmin_logout,Create_UserBy_SubAdmin,updateUserBySubAdmin,deleteUserBySubAdmin,getAllUsersWithPagination,getUserById } = require("../Controller/SubAdmin")
const router = express.Router()



router.route("/SubAdminLogin").post(SubAdminLogin)
router.route("/SubAdmin_logout").get(isAuthJWT,SubAdmin_logout)

router.route("/Create_UserBy_SubAdmin").post(isAuthJWT, authorizeRoles("SubAdmin"),Create_UserBy_SubAdmin);
router.route("/update/:id").put(isAuthJWT,authorizeRoles("SubAdmin"),updateUserBySubAdmin)
router.route("/deletuser/:id").delete(isAuthJWT,authorizeRoles("SubAdmin"),deleteUserBySubAdmin)
router.route("/getauser/:id").get(isAuthJWT, authorizeRoles("SubAdmin"),getUserById)
router.route("/getalluser").get(isAuthJWT, authorizeRoles("SubAdmin"),getAllUsersWithPagination)


module.exports = router;