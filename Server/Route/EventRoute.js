const express = require("express")
const router = express.Router()
const { isAuthJWT, authorizeRoles } = require("../Utils/jwt")
const { addFood, updateFood, deleteFood, getFoodById, getAllFoods } = require("../Controller/FoodAuth")
const { addEvent, getAllEvents, deleteEvent, getEventById, joinTheEvent, getEventByOwnerID,deleteEventByOwnerID } = require("../Controller/EventAuth")


router.route("/addFood").post(isAuthJWT, authorizeRoles("Admin"),addFood)
router.route("/updateFood/:id").put(isAuthJWT, authorizeRoles("Admin"),updateFood)
router.route("/deleteFood/:id").delete(isAuthJWT, authorizeRoles("Admin"),deleteFood)
router.route("/getFoodById/:id").get(isAuthJWT, authorizeRoles("Admin"),getFoodById)
router.route("/getAllFoods").get(isAuthJWT,getAllFoods)
// router.route("/getfood").get(isAuthJWT, authorizeRoles("User"),getAllFoodForUser)

router.route("/addEvent").post(isAuthJWT,addEvent)
router.route("/getAllEvent").post(isAuthJWT,getAllEvents)
router.route("/getEventById/:id").get(isAuthJWT,getEventById)
router.route("/deleteEvent/:id").delete(isAuthJWT, deleteEvent)
router.route("/joinevent").post(isAuthJWT, joinTheEvent)
router.route("/getEventByOwner").get(isAuthJWT,getEventByOwnerID)

// Delete Event by Owner ID
router.delete("/deleteEventByOwner/:userId/:eventId", isAuthJWT, deleteEventByOwnerID);
module.exports = router;