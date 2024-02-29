const express = require("express");
const router = express.Router();

const {
      createRole,
      roles,
      updateRole
} = require("../controllers/RoleController");

router.post("/", createRole);
router.get("/", roles);
router.patch("/", updateRole);

module.exports = router