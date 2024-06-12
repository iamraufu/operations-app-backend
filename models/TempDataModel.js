const mongoose = require("mongoose")

const tempSchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
      },
      type: {
            type: String,
            required: true
      },
      data: {
            type: Array
      }
}, {
      timestamps: true
})

module.exports = mongoose.model("TempData", tempSchema)