const mongoose = require('mongoose');

const stoTrackingSchema = new mongoose.Schema({
      sto: {
            type: String,
            required: true,
            immutable: true
      },
      dn: {
            type: String,
            default: '',
      },
      grn: {
            type: String,
            default: '',
      },
      createdOnSAP: {
            type: String,
            required: true,
            immutable: true
      },
      // createdAt: {
      //       type: Date,
      //       default: new Date(),
      //       immutable: true
      // },
      // updatedAt: {
      //       type: Date,
      //       default: null
      // },
      deliveryDate: {
            type: Date,
            default: null
      },
      supplyingPlant: {
            type: String,
            required: true
      },
      receivingPlant: {
            type: String,
            required: true
      },
      sku: {
            type: Number,
            required: true
      },
      pickedSku: {
            type: Number,
            default: null
      },
      packedSku: {
            type: Number,
            default: null
      },
      status: {
            type: String,
            default: 'pending for dn',
            // enum:['pending for dn', 'in dn', 'pending for grn', 'in grn', 'picker assigned', 'packer assigned', 'picker packer assigned', 'inbound picking', 'inbound packing', 'inbound picked', 'inbound packed']
      },
      picker: {
            type: String,
            default: null
      },
      pickerId: {
            type: String,
            default: null
      },
      packer: {
            type: String,
            default: null
      },
      packerId: {
            type: String,
            default: null
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
},{timestamps: true})

module.exports = mongoose.model("STOTracking", stoTrackingSchema)