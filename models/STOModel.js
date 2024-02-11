const mongoose = require("mongoose")

const stoSchema = new mongoose.Schema({
      sto: {
            type: number,
            required: true
      }
})

module.exports = mongoose.model("Sto", stoSchema)