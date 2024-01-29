const mongoose = require("mongoose")


const POSchema = new mongoose.Schema({
      po: {
            type: String,
            required: true
      },
      documentType: {
            type: String,
            required: true
      },
      createdDate: {
            type: String,
            required: true
      },
      createdBy: {
            type: String,
            required: true
      },
      documentDate: {
            type: String
      },
      supplyingPlant: {
            type: String,
            required: true
      },
      supplyingPlantName: {
            type: String,
            required: true
      },
      supplyingPlantAddress: {
            type: String,
            required: true
      },
      supplyingPlantStreet: {
            type: String
      },
      supplyingPlantCity: {
            type: String
      },
      supplyingPlantPostCode: {
            type: String
      },
      items: {
            type: [{
                  po: {
                        type: String,
                        required: true
                  },
                  changedOn: {
                        type: String,
                        required: true
                  },
                  material: {
                        type: String,
                        required: true
                  },
                  description: {
                        type: String,
                        required: true
                  },
                  receivingPlant: {
                        type: String,
                        required: true
                  },
                  materialGroup: {
                        type: String,
                        required: true
                  },
                  quantity: {
                        type: Number,
                        required: true
                  },
                  unit: {
                        type: String,
                        required: true
                  },
                  netWeight: {
                        type: Number,
                        required: true
                  },
                  weightUnit: {
                        type: String,
                        required: true
                  },
                  barcode: {
                        type: Number,
                        required: true
                  }
            }]
      }
})

module.exports = mongoose.model("PO", POSchema)