const mongoose = require("mongoose")

const productShelvingSchema = new mongoose.Schema({
      po: {
            type: String,
      },
      sto: {
            type: String
      },
      code: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      batch: {
            type: String,
            default: null
      },
      expiryDate: {
            type: Date,
            default: null
      },
      mfgDate: {
            type: Date,
            default: null
      },
      mrp: {
            type: Number,
            default: null
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
      bins: {
            type: [
                  {
                        bin_id: {
                              type: String,
                              required: true,
                              default: ""
                        },
                        gondola_id: {
                              type: String,
                              required: true,
                              default: ""
                        }
                  }
            ],
            required: true,
            default: []
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
},{
      timestamps: true
})

module.exports = mongoose.model("ProductShelving", productShelvingSchema)