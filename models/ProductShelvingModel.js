const mongoose = require("mongoose")

const productShelvingSchema = new mongoose.Schema({
      po: {
            type: String,
            required: true,
      },
      code: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      date: {
            type: Date,
            required: true,
            default: new Date()
      },
      userId: {
            type: String,
            required: true
      },
      receivedBy: {
            type: String,
            required: true
      },
      site: {
            type: String,
            required: true
      },
      name: {
            type: String
      },
      quantity: {
            type: Number,
            required: true,
            min: 0,
      },
      receivedQuantity: {
            type: Number,
            required: true,
            min: 0,
      },
      status: {
            type: String,
            required: true,
            default: "ready for shelving"
      },
      inShelf: {
            type: [{
                  gondola: {
                        type: String,
                        required: true
                  },
                  bin: {
                        type: String,
                        required: true
                  },
                  quantity: {
                        type: Number,
                        required: true,
                        default: 0
                  },
                  updatedAt: {
                        type: Date,
                        required: true,
                        default: new Date()
                  }
            }],
            default: []
      }
})

module.exports = mongoose.model("ProductShelving", productShelvingSchema)