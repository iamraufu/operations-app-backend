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
      po: {
            type: String,
            default: ""
      },
      sto: {
            type: String,
            default: ""
      },
      dn: {
            type: String,
            default: ""
      },
      grn: {
            type: String,
            default: ""
      },
      status: {
            type: String,
            default: "in document"
      },
      quantity: {
            type: Number,
            required: true
      },
      inboundPickedQuantity: {
            type: Number,
            default: null
      },
      inboundPackedQuantity: {
            type: Number,
            default: null
      },
      inboundPicker: {
            type: String,
            default: ""
      },
      inboundPacker: {
            type: String,
            default: ""
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
            default: ""
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