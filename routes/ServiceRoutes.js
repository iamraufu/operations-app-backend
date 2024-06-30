const express = require("express");
const router = express.Router();

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      pickingSTO,
      getVendorDetails
} = require("../controllers/ServiceController");

router.post("/sto-picking", tokenVerify, pickingSTO);
router.post("/vendor-details",  getVendorDetails);

module.exports = router