const mongoose = require("mongoose")

const outletSchema = new mongoose.Schema({
      code: {
            type: String,
            trim: true,
            unique: true,
            required: true
      },
      name: {
            type: String,
            trim: true,
            unique: true,
            required: true
      },
      address: {
            type: String,
            trim: true
      },
      district: {
            type: String,
            trim: true,
            required: true
      },
      zone: {
            type: String,
            trim: true,
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

module.exports = mongoose.model("Outlet", outletSchema)