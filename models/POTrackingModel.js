const mongoose = require('mongoose');

const poTrackingSchema = new mongoose.Schema({
      po: {
            type: String,
            required: true
      }, 
      grn: {
            type: String,
            default: ''
      },
      createdOnSAP: {
            type: String,
            required: true
      },
      createdAt: {
            type: Date,
            default: new Date(),
            immutable: true
      },
      updatedAt: {
            type: Date,
            default: null
      },
      deliveryDate: {
            type: Date,
            default: null
      },
      supplyingPlant: {
            type: String,
      },
      receivingPlant: {
            type: String,
            required: true
      },
      sku: {
            type: Number,
            required: true
      },
      status: {
            type: String,
            default: 'pending for grn'
      },
      picker: {
            type: String,
            default: '',
      },
      packer: {
            type: String,
            default: '',
      },
      pickingStartingTime: {
            type: Date,
            default: null,
      },
      pickingEndingTime: {
            type: Date,
            default: null,
      },
      packingStartingTime: {
            type: Date,
            default: null,
      },
      packingEndingTime: {
            type: Date,
            default: null,
      }
})

module.exports = mongoose.model("POTracking", poTrackingSchema)