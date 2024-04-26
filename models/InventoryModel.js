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
      onHold: {
            type: Number,
            default: 0
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
      createdAt: {
            type: Date,
            default: new Date()
      },
      updatedAt: {
            type: Date,
            default: null
      },
      bin: {
            type: String,
            required: true,
      },
      gondola: {
            type: String,
            required: true,
      },
      tracking: {
            type: [{
                  batch: {
                        type: String,
                        default: null
                  },
                  expiryDate: {
                        type: Date,
                        default: null
                  },
                  quantity: {
                        type: Number,
                        required: true,
                        default: 0
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
            }]
      }
})

module.exports = mongoose.model("Inventory", inventorySchema)