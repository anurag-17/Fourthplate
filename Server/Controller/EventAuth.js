const Event = require("../Model/Event");
// const calculateDistance = require("../Utils/DistanceCalculate");
const mongoose = require("mongoose");

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
            ownerId : req.user._id,
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();

        // Respond with the saved event
        res.status(201).json({
            success: true,
            message: 'Event added successfully',
            event: savedEvent
        });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({
            success: false,
            message: 'Server error occurred while adding the event',
            error: error.message
        });
    }
};

// Update event controller
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error occurred while updating the event',
            error: error.message
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
                message: 'Event not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error occurred while deleting the event',
            error: error.message
        });
    }
};

// Get event by ID controller
exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id).populate('food').populate('ownerId');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found.'
            });
        }

        res.status(200).json({
            success: true,
            event: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error occurred while retrieving the event',
            error: error.message
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
    let { page = 1, limit = 10 } = req.query;
    const { eventName, location, food, allowMember, coordinates, state, city, latitude, longitude, distance = 1} = req.body
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    let query = {};

    // Basic text search for eventName and location
    if (eventName) query.eventName = new RegExp(eventName, 'i'); // Case-insensitive regex search
    if (location) query.location = new RegExp(location, 'i');
    if (state) query.state = state;
    if (city) query.city = city;
    
    // if (food) query.food = mongoose.Types.ObjectId(food);
    if (food) {
        const foodIds = food.split(","); 
        query.food = { $in: foodIds };
      }

    // Filter by maximum number of people allowed
    if (allowMember) query.allowMember = { $lte: parseInt(allowMember, 10) };

    // Adjusted geospatial filtering based on coordinates and perimeter distance
    if (latitude && longitude) {
        try {
            query.latitude = { $exists: true };
            query.longitude = { $exists: true };
            const allEvents = await Event.find(query)
                .populate("food")
                .populate("ownerId");
    
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
                data: eventsOnPage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error occurred while retrieving events',
                error: error.message
            });
        }
    }
     else {
        try {
            const total = await Event.countDocuments(query);
            const events = await Event.find(query).populate('food').populate('ownerId').skip(skip).limit(limit);

            res.status(200).json({
                success: true,
                count: events.length,
                page,
                totalPages: Math.ceil(total / limit),
                data: events
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error occurred while retrieving events',
                error: error.message
            });
        }
    }
};

// Function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    // Formula to calculate distance between two coordinates (Haversine formula)
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}