const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
            immutable: true
      }, 
      phone: {
            type: String,
            required: true,
            immutable: true
      },
      code: {
            type: String,
            required: true,
            immutable: true
      },
      description: {
            type: String,
            required: true,
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
      promo: {
            type: String,
            required: true,
            immutable: true
      },
      invoice: {
            type: String,
            default: null
      },
      status: {
            type: String,
            default: 'sms sent'
      }
})

module.exports = mongoose.model("SMS", smsSchema)