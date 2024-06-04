const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
      name: {
            type: String,
            trim: true,
            required: true
      },
      email: {
            type: String,
            unique: true,
            // required: true,
            immutable: true
      },
      password: {
            type: String,
            required: true
      },
      staffId: {
            type: String,
            // required: true,
            unique: true,
            immutable: true
      },
      site: {
            type: Array,
            of: String,
            default: [],
            required: true
      },
      role: {
            type: String,  // admin or user etc.
            default: "user",
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
            default: new Date(),
            immutable: true
      },
      updatedAt: {
            type: Date,
            default: null
      }
})

module.exports = mongoose.model("User", userSchema)