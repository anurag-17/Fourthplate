const Food = require("../Model/Food");

// Add food controller

// exports.addFood = async (req, res) => {
//   const { name } = req.body; // Extract the name of the food from the request body
// console.log("name");
//   // Check if the food name was provided
//   if (!name) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide the name of the food.",
//     });
//   }

//   try {
//     // Check if the food item already exists
//     const existingFood = await Food.findOne({ name });
//     if (existingFood) {
//       return res.status(409).json({
//         success: false,
//         message: "Food item already exists.",
//       });
//     }

//     // Create a new food item
//     const newFood = new Food({ name });
//     await newFood.save(); // Save the new food item to the database

//     // Respond with the newly created food item
//     res.status(201).json({
//       success: true,
//       message: "Food item added successfully.",
//       data: newFood,
//     });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     res.status(500).json({
//       success: false,
//       message: "Server error occurred while adding the food item.",
//       error: error.message,
//     });
//   }
// };

exports.addFood = async (req, res, next) => {
  try {
    const { name} = req.body;
    
    // Create a new habit object
    const newHabit = new Food({
      name
    });

    // Save the new habit to the database
    await newHabit.save();

    res.status(201).json({ success: true, data: newHabit });
  } catch (error) {
    next(error);
  }
};





// Update food item controller
exports.updateFood = async (req, res) => {
  const { id } = req.params; // Extract the food item's ID from the request parameters
  const updateData = req.body; // The data to update the food item with

  try {
    // Find the food item by ID and update it
    // Ensure new: true to return the updated document and runValidators: true to apply schema validations
    const updatedFood = await Food.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFood) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found." });
    }

    // Successfully updated
    res
      .status(200)
      .json({
        success: true,
        message: "Food item updated successfully.",
        data: updatedFood,
      });
  } catch (error) {
    // Handle possible errors, such as a validation error or database issues
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating food item.",
        error: error.message,
      });
  }
};

// Delete food item controller
exports.deleteFood = async (req, res) => {
  const { id } = req.params; // Extract the food item's ID from the request parameters

  try {
    // Attempt to delete the food item by ID
    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found." });
    }

    // Successfully deleted
    res
      .status(200)
      .json({ success: true, message: "Food item deleted successfully." });
  } catch (error) {
    // Handle possible errors, such as a database error
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting food item.",
        error: error.message,
      });
  }
};

// Get food item by ID controller
exports.getFoodById = async (req, res) => {
  const { id } = req.params; // Extract the food item's ID from the request parameters

  try {
    // Attempt to find the food item by ID
    const foodItem = await Food.findById(id);

    if (!foodItem) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found." });
    }

    // Successfully found the food item
    res.status(200).json({ success: true, data: foodItem });
  } catch (error) {
    // Handle possible errors, such as a database error or invalid ID format
    res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving food item.",
        error: error.message,
      });
  }
};

// Get all food items with pagination, search by name, and sort by name A to Z
exports.getAllFoods = async (req, res) => {
  let { page = 1, limit = 1000, name } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const skip = (page - 1) * limit;

  // Building the search query
  const searchQuery = name ? { name: { $regex: name, $options: "i" } } : {};

  try {
    // Find all foods with search criteria, apply sorting, pagination, and count total documents
    const foods = await Food.find(searchQuery)
      .sort({ name: 1 }) // Sort by name A to Z
      .skip(skip)
      .limit(limit);

    const total = await Food.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: foods.length,
      page,
      totalPages: Math.ceil(total / limit),
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while retrieving food items.",
      error: error.message,
    });
  }
};


