const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
      material: {
            type: String,
            required: true
      },
      description: {
            type: String,
      },
      quantity: {
            type: Number,
            required: true
      },
      site: {
            type: String,
            required: true
      },
      status: {
            type: String,
            required: true,
            default: 'active'
      },
      updatedAt: {
            type: Date,
            default: new Date()
      },
      onHold: {
            type: Number,
            default: 0
      },
      bin: {
            type: String,
            required: true,
      },
      gondola: {
            type: String,
            required: true,
      }
})

module.exports = mongoose.model("Inventory", inventorySchema)