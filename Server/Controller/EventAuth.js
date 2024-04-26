const Event = require("../Model/Event");
// const calculateDistance = require("../Utils/DistanceCalculate");
const mongoose = require("mongoose");
const User = require("../Model/User");

// Add event controller
exports.addEvent = async (req, res) => {
  const {
    eventName,
    description,
    date,
    time,
    location,
    allowMember,
    images,
    // coordinates,
    state,
    city,
    latitude,
    longitude,
    food,
  } = req.body;

  try {
    const newEvent = new Event({
      eventName,
      description,
      date,
      time,
      location,
      allowMember,
      images,
      // coordinates,
      state,
      city,
      latitude,
      longitude,
      food,
      ownerId: req.user._id,
    });

    // Save the event to the database
    const savedEvent = await newEvent.save();

    // Respond with the saved event
    res.status(201).json({
      success: true,
      message: "Event added successfully",
      event: savedEvent,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      message: "Server error occurred while adding the event",
      error: error.message,
    });
  }
};

// Update event controller
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while updating the event",
      error: error.message,
    });
  }
};

// Delete event controller
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while deleting the event",
      error: error.message,
    });
  }
};

// Get event by ID controller
exports.getEventById = async (req, res) => {
  console.log("qqqq");
  const { id } = req.params;

  try {
    const event = await Event.findById(id).populate("food").populate("ownerId");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      event: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while retrieving the event",
      error: error.message,
    });
  }
};

// // Get all events with pagination, search, and filters
// exports.getAllEvents = async (req, res) => {
//     const { page = 1, limit = 10} = req.query;
//     const {eventName, location, food, allowMember,coordinates, distance = 5} = req.body
//     const skip = (page - 1) * limit;
//     let query = {};

//     // Basic text search for eventName and location
//     if (eventName) query.eventName = new RegExp(eventName, 'i'); // Case-insensitive regex search
//     if (location) query.location = new RegExp(location, 'i');

//     // Filter by type of food (assuming food is a string/ID)
//     if (food) query.food = food;

//     // Filter by maximum number of people allowed
//     if (allowMember) query.allowMember = { $lte: parseInt(allowMember, 10) };

//     // Geospatial filtering based on coordinates and perimeter distance
//     // Assuming req.query contains 'longitude', 'latitude', and 'distance' parameters

//     try {
//         const total = await Event.countDocuments(query);
//         const events = await Event.find(query).populate("food").populate("ownerId")
//         if (coordinates.latitude && coordinates.longitude) {
//             events = events.filter((event)=>{
//                 if (events.coordinates&&events.coordinates[0].latitude&& events.coordinates[0].longitude) {

//                     const calculated = calculateDistance(coordinates.latitude,coordinates.longitude, event.coordinates[0].latitude,event.coordinates[0].longitude)
//                     return calculated <= distance
//                 }else {
//                     return false;
//                   }
//             })
//         }
//         const totalevents = events.length
//         const page = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.limit) || 10;
//         const totalPages = Math.ceil(totalevents / pageSize);
//         const startIndex = (page - 1) * pageSize;
//         const endIndex = Math.min(startIndex + pageSize, totalevents);
//         const paginatedEvents = events.slice(startIndex, endIndex)

//         res.status(200).json({
//             success: true,
//             count: totalevents,
//             page,
//             totalPages,
//             data: paginatedEvents
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error occurred while retrieving events',
//             error: error.message
//         });
//     }
// };

// Get all events with pagination, search, and filters
exports.getAllEvents = async (req, res) => {
  console.log("vvvv");
  let { page = 1, limit = 100 } = req.query;
  const {
    search,
    // eventName,
    // location,
    food,
    allowMember,
    // coordinates,
    // state,
    // city,
    latitude,
    longitude,
    distance = 30,
  } = req.body;
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;
  let query = {};

  // Basic text search for eventName and location
    // Dynamic search handling
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive regex
      query.$or = [
        { eventName: searchRegex },
        { location: searchRegex },
        { state: searchRegex },
        { city: searchRegex }
      ];
    }
  // if (eventName) query.eventName = new RegExp(eventName, "i"); // Case-insensitive regex search
  // if (location) query.location = new RegExp(location, "i");
  // if (state) query.state = state;
  // if (city) query.city = city;

  // if (food) query.food = mongoose.Types.ObjectId(food);
 // Filter by food IDs
 if (food) {
  query.food = new mongoose.Types.ObjectId(food); // Convert string ID to ObjectId
}

// const eventId = req.params.eventId; // Assuming you're passing the event ID as a parameter
// const event = await Event.findById(eventId).populate("food");


//  if(food){
//   const foodIds = food.split(",").map(id => mongoose.Types.ObjectId(id)); // Convert string IDs to ObjectId
//   query.food = { $in: foodIds };
// }

  // Filter by maximum number of people allowed
  if (allowMember) query.allowMember = { $lte: parseInt(allowMember, 10) };

  // Adjusted geospatial filtering based on coordinates and perimeter distance
  if (latitude && longitude) {
    try {
      query.latitude = { $exists: true };
      query.longitude = { $exists: true };

      // const allEvents = await Event.find(query)
      //   .populate("food")
      //   .populate("ownerId")
      //   .populate("joinerId");
        
        
      const allEvents = await Event.find(query)
      .populate("food")
      .populate("ownerId")
      .populate({
        path: "joinerId", // Populate the joinerId field
        // No need to populate further nested fields
      });

      console.log("allEvents",allEvents);
    

      // Filter events based on distance within specified range
      const filteredEvents = allEvents.filter((event) => {
        // Check if latitude and longitude are defined for the event
        if (event.latitude !== undefined && event.longitude !== undefined) {
          const distanceFromEvent = calculateDistance(
            latitude,
            longitude,
            event.latitude,
            event.longitude
          );
          return distanceFromEvent <= distance;
        } else {
          return false; // Exclude events with missing latitude or longitude
        }
      });

      const total = filteredEvents.length;
      const eventsOnPage = filteredEvents.slice(skip, skip + limit);

      res.status(200).json({
        success: true,
        count: eventsOnPage.length,
        page,
        totalPages: Math.ceil(total / limit),
        data: eventsOnPage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error occurred while retrieving events",
        error: error.message,
      });
    }
  } else {
    try {
      const total = await Event.countDocuments(query);

      const events = await Event.find(query)
        .populate("food")
        .populate("ownerId")
        .populate("joinerId")
        .skip(skip)
        .limit(limit);

console.log("events",events);


      res.status(200).json({
        success: true,
        count: events.length,
        page,
        totalPages: Math.ceil(total / limit),
        data: events,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error occurred while retrieving events",
        error: error.message,
      });
    }
  }
};

// Function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Formula to calculate distance between two coordinates (Haversine formula)
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

exports.joinTheEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Validate userId and eventId
    if (
      !userId ||
      !eventId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      return res.status(404).json({
        success: false,
        message: "userId or eventId not found or invalid.",
      });
    }

    // Fetch the event to check current number of joiners and allowed members
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({
        success: false,
        message: "User or Event not found.",
      });
    }

    // Check if user already joined
    const isUserJoined = event.joinerId.includes(userId);

    if (isUserJoined) {
      // If the user is already joined, remove them and increment allowMember
      await Event.findByIdAndUpdate(
        eventId,
        {
          $pull: { joinerId: userId },
          $inc: { allowMember: 1 },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $pull: { eventJoined: eventId } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "User has left the event successfully.",
      });
    } else {
      // Before adding the user, ensure the event is not full
      if (event.allowMember <= 0) {
        return res.status(400).json({
          success: false,
          message: "Event is full. No more members can join.",
        });
      }

      // Add the user to the event and decrement allowMember
      await Event.findByIdAndUpdate(
        eventId,
        {
          $push: { joinerId: userId },
          $inc: { allowMember: -1 },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { eventJoined: eventId } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "User joined the event successfully.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getEventByOwnerID = async(req, res) => {
    try {
      // Assuming req.user._id is set and valid thanks to previous middleware (like authentication)
      const id = req.user._id ;
      // Find all events where the ownerId matches the current user's ID
      const events = await Event.find({ ownerId: id }).populate("food").populate("ownerId").populate({
        path: "joinerId", // Populate the joinerId field
        // No need to populate further nested fields
      });
    // const events = await Event.find(id).populate("food").populate("ownerId");


      // Check if events exist for the user
      if (!events || events.length === 0) {
        return res.status(404).json({
          success: true,
          message: "No events found for the specified owner.",
        });
      }

      // If events are found, return them
      return res.status(200).json({
        success: true,
        message: "Events retrieved successfully.",
        data: events, // Sending the found events as data
      });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
    }
};
 
