const Event = require("../Model/Event");
const calculateDistance = require("../Utils/DistanceCalculate");

// Add event controller
exports.addEvent = async (req, res) => {
    // Extract event details from the request body
    const {
        eventName,
        description,
        date,
        time,
        location,
        allowMember,
        images,
        coordinates,
        food,
       
    } = req.body;

    try {
        // Create a new event document
        const newEvent = new Event({
            eventName,
            description,
            date,
            time,
            location,
            allowMember,
            images,
            coordinates,
            food, // Assuming this is meant to be a reference to a User document representing a food provider or similar
            ownerId : req.user._id , // The ID of the user creating the event
          
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
    const { id } = req.params; // Assuming the event's ID is passed as a URL parameter
    const updateData = req.body; // The updated information is expected to be in the request body

    try {
        // Find the event by ID and update it with the new data
        // { new: true } option makes sure the updated document is returned
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        // If the event with the given ID doesn't exist, return a 404 error
        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found.'
            });
        }

        // Return the updated event information
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });
    } catch (error) {
        // Handle possible errors, such as a bad request or a server error
        res.status(500).json({
            success: false,
            message: 'Server error occurred while updating the event',
            error: error.message
        });
    }
};


// Delete event controller
exports.deleteEvent = async (req, res) => {
    const { id } = req.params; // Assuming the event's ID is passed as a URL parameter

    try {
        // Attempt to delete the event by ID
        const deletedEvent = await Event.findByIdAndDelete(id);

        // If no event was found (and thus not deleted), return a 404 error
        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found.'
            });
        }

        // Respond to the client upon successful deletion
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        // Handle any errors that occur during the deletion process
        res.status(500).json({
            success: false,
            message: 'Server error occurred while deleting the event',
            error: error.message
        });
    }
};

// Get event by ID controller
exports.getEventById = async (req, res) => {
    const { id } = req.params; // Assuming the event's ID is passed as a URL parameter

    try {
        // Attempt to find the event by ID
        const event = await Event.findById(id);

        // If no event is found, return a 404 error
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found.'
            });
        }

        // Respond with the found event
        res.status(200).json({
            success: true,
            event: event
        });
    } catch (error) {
        // Handle any errors that occur during the process
        // This could include handling invalid ID format errors
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
    const { eventName, location, food, allowMember, coordinates, distance = 1} = req.body
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    let query = {};

    // Basic text search for eventName and location
    if (eventName) query.eventName = new RegExp(eventName, 'i'); // Case-insensitive regex search
    if (location) query.location = new RegExp(location, 'i');

    // Filter by type of food (assuming food is a string/ID)
    if (food) query.food = mongoose.Types.ObjectId(food);

    // Filter by maximum number of people allowed
    if (allowMember) query.allowMember = { $lte: parseInt(allowMember, 10) };

    // Adjusted geospatial filtering based on coordinates and perimeter distance
    if (coordinates && coordinates.latitude && coordinates.longitude) {
        // Assuming coordinates are provided as numbers and distance is in kilometers
        query['coordinates'] = {
            $near: {
                $geometry: { type: "Point", coordinates: [ parseFloat(coordinates[0].longitude), parseFloat(coordinates[0].latitude) ] },
                $maxDistance: distance * 1000 // Convert kilometers to meters
            }
        };
    }

    try {
        const total = await Event.countDocuments(query);
        let events = await Event.find(query).populate('food').populate('ownerId').skip(skip).limit(limit);

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
};