const express = require("express")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { isAuthJWT, authorizeRoles } = require("../Utils/jwt")
const { SubAdminLogin } = require("../Controller/SubAdmin")
const router = express.Router()



router.route("/SubAdminLogin").post(SubAdminLogin)

module.exports = router;