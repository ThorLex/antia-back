const Client = require("../models/client");

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, email } = req.body;
    const createdBy = req.user.id;
    const agency = req.user.where_agency;

    const client = new Client({
      name,
      email,
      createBy: createdBy,
      from_agency: agency,
    });

    await client.save();
    res.status(201).json({ message: "Client created successfully", client });
  } catch (err) {
    res.status(500).json({ message: "Error creating client", error: err.message });
  }
};

// Get all clients for the user's agency
exports.getClients = async (req, res) => {
  try {
    const agency = req.user.where_agency;
    // Find clients that are not soft-deleted and belong to the user's agency
    const clients = await Client.find({ from_agency: agency, isDelete: false }).populate('createBy', 'name email');
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clients", error: err.message });
  }
};

// Get a specific client by ID
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, isDelete: false });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    // Optional: Check if the client belongs to the user's agency
    if (client.from_agency.toString() !== req.user.where_agency) {
        return res.status(403).json({ message: "Forbidden: You do not have access to this client." });
    }
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: "Error fetching client", error: err.message });
  }
};

// Update an existing client
exports.updateClient = async (req, res) => {
  try {
    const { name, email } = req.body;
    const client = await Client.findById(req.params.id);

    if (!client || client.isDelete) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Optional: Check if the client belongs to the user's agency
    if (client.from_agency.toString() !== req.user.where_agency) {
        return res.status(403).json({ message: "Forbidden: You do not have access to this client." });
    }
    
    client.name = name || client.name;
    client.email = email || client.email;
    
    const updatedClient = await client.save();

    res.status(200).json({ message: "Client updated successfully", client: updatedClient });
  } catch (err) {
    res.status(500).json({ message: "Error updating client", error: err.message });
  }
};

// Soft delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || client.isDelete) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    // Optional: Check if the client belongs to the user's agency
    if (client.from_agency.toString() !== req.user.where_agency) {
        return res.status(403).json({ message: "Forbidden: You do not have access to this client." });
    }

    client.isDelete = true;
    await client.save();
    
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting client", error: err.message });
  }
};
