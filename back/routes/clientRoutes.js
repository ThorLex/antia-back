const express = require("express");
const router = express.Router();
const {
  getClients,
  createClient,
  getClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

router.get("/", getClients);
router.post("/", createClient);
router.get("/:id", getClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
