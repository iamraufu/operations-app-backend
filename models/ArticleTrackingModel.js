const mongoose = require('mongoose');

const articleTrackingSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      code: {
            type: String,
            required: true
      },
      sto: {
            type: String,
            default: null
      },
      dn: {
            type: String,
            default: null
      },
      grn: {
            type: String,
            default: null
      },
      supplyingSite: {
            type: String,
            required: true
      },
      receivingSite: {
            type: String,
            required: true
      },
      status: {
            type: String,
            default: "in document",
            enum: ["in document", "inbound picking", "partially inbound picked", "inbound picked", "inbound packing", "inbound packed", "outbound delivering", "outbound delivered", "in transit", "ready for child packing", "partially ready for child packing", ]
      },
      expiryDate: {
            type: Date,
            default: null
      },
      quantity: {
            type: Number,
            required: true
      },
      inboundPickedQuantity: {
            type: Number,
            default: 0
      },
      inboundPackedQuantity: {
            type: Number,
            default: 0
      },
      inboundPicker: {
            type: String,
            default: null
      },
      inboundPickerId: {
            type: String,
            default: ''
      },
      inboundPacker: {
            type: String,
            default: ''
      },
      inboundPackerId: {
            type: String,
            default: ''
      },
      inboundPickingStartingTime: {
            type: Date,
            default: null
      },
      inboundPickingEndingTime: {
            type: Date,
            default: null
      },
      inboundPackingStartingTime: {
            type: Date,
            default: null
      },
      inboundPackingEndingTime: {
            type: Date,
            default: null
      },
      outboundPicker: {
            type: String,
            default: null
      },
      outboundPickingStartingTime: {
            type: Date,
            default: null
      },
      outboundPickingEndingTime: {
            type: Date,
            default: null
      }
})

module.exports = mongoose.model('ArticleTracking', articleTrackingSchema)