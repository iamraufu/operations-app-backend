const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
      role: {
            type: String,  // admin or user
            default: "user",
            required: true,
            immutable: true
      },
      hasPermission: {
            type: Array,
            of: String,   // array of strings that represent the permissions a user has
            default: [],
            required: true
      },
      isDeleted: {
            type: Boolean,
            default: false,
      },
      createdAt: {
            type: Date,
            default: new Date()
      },
      updatedAt: {
            type: Date,
            default: null
      }
})

module.exports = mongoose.model("Role", roleSchema)