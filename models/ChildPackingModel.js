const mongoose = require('mongoose')

const childPackingModel = new mongoose.Schema({
      sto: {
            type: String,
            required: true,
      },
      dn: {
            type: String,
            required: true,
      },
      barcode: {
            type: String,
            required: true,
            unique: true
      },
      supplyingSite: {
            type: String,
            required: true
      },
      receivingSite: {
            type: String,
            required: true
      },
      count: {
            type: Number,
            required: true,
            min: 1
      },
      packedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
      },
      dateTimePacked: {
            type: Date,
            required: true,
            default: new Date()
      },
      list: {
            type: [
                  {
                        material: {
                              type: String,
                              required: true
                        },
                        dnItem: {
                              type: String,
                              required: true
                        },
                        description: {
                              type: String,
                              required: true
                        },
                        quantity: {
                              type: Number,
                              required: true,
                              min: 1
                        }
                  }
            ]
      }
})

childPackingModel.index({ barcode: 1 })

module.exports = mongoose.model("childPacking", childPackingModel)