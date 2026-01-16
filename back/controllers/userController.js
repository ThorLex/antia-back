const User = require("../models/User");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users", error: err });
  }
};

// Create a new user (Admin only)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, where_agency } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            name,
            email,
            password, // Password will be hashed by the pre-save hook in the model
            role,
            where_agency
        });

        const newUser = await user.save();
        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err });
    }
};

// Update a user (Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, where_agency } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.where_agency = where_agency || user.where_agency;

        const updatedUser = await user.save();
        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err });
    }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err });
    }
};
