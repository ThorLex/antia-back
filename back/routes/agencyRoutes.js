const express = require("express");
const router = express.Router();
const {
  getAgencies,
  createAgency,
  getAgency,
  updateAgency,
  deleteAgency,
} = require("../controllers/agencyController");

router.get("/", getAgencies);
router.get("/:id", getAgency);
router.post("/", createAgency);
router.put("/:id", updateAgency);
router.delete("/:id", deleteAgency);

module.exports = router;
