const express = require("express");
const router = express.Router();

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      pickingSTO
} = require("../controllers/ServiceController");

router.post("/sto-picking", tokenVerify, pickingSTO);

module.exports = router