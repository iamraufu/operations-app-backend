const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({
      code: {
            type: Number,
            required: true,
            unique: true
      },
      description: {
            type: String,
            required: true
      }
})

module.exports = mongoose.model("Article", articleSchema)