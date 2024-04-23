const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
      phone: {
            type: String,
            default: null,
            immutable: true
      },
      code: {
            type: String,
            required: true,
            immutable: true
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
      outlet: {
            type: String,
            default: null,
            immutable: true
      },
      invoice: {
            type: String,
            default: '',
            immutable: true
      },
      status: {
            type: String,
            default: 'unused'
      }
})

module.exports = mongoose.model("PromoCode", promoCodeSchema)