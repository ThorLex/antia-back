const Agency = require("../models/agency");

// Create a new agency (Admin only)
exports.createAgency = async (req, res) => {
    try {
        const { name, code, address, phoneNumber } = req.body;

        const agencyExists = await Agency.findOne({ code });
        if (agencyExists) {
            return res.status(400).json({ message: "Agency with this code already exists" });
        }

        const agency = new Agency({
            name,
            code,
            address,
            phoneNumber
        });

        const newAgency = await agency.save();
        res.status(201).json({ message: "Agency created successfully", agency: newAgency });

    } catch (err) {
        res.status(500).json({ message: "Error creating agency", error: err.message });
    }
};

// Get all agencies
exports.getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.status(200).json(agencies);
  } catch (err) {
    res.status(500).json({ message: "Error fetching agencies", error: err.message });
  }
};

// Get a single agency by ID
exports.getAgency = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }
    res.status(200).json(agency);
  } catch (err) {
    res.status(500).json({ message: "Error fetching agency", error: err.message });
  }
};

// Update an agency (Admin only)
exports.updateAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, address, phoneNumber } = req.body;

        const agency = await Agency.findById(id);
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }

        agency.name = name || agency.name;
        agency.code = code || agency.code;
        agency.address = address || agency.address;
        agency.phoneNumber = phoneNumber || agency.phoneNumber;

        const updatedAgency = await agency.save();
        res.status(200).json({ message: "Agency updated successfully", agency: updatedAgency });

    } catch (err) {
        res.status(500).json({ message: "Error updating agency", error: err.message });
    }
};

// Delete an agency (Admin only)
exports.deleteAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await Agency.findByIdAndDelete(id);

        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }

        // What to do with users and clients of this agency? 
        // For now, we'll just delete the agency. 
        // A more robust solution would be to reassign them or prevent deletion if there are associated users/clients.

        res.status(200).json({ message: "Agency deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting agency", error: err.message });
    }
};
