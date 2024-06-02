const mongoose = require("mongoose")

const grnSchema = new mongoose.Schema({
      po: {
            type: String,
            required: true
      },
      dn: {
            type: String,
      },
      grn: {
            type: String,
      },
      tpn: {
            type: String,
      },
      status: {
            type: String,
            required: true
      },
      createdAt: {
            type: Date,
            default: new Date(),
      },
      updatedAt: {
            type: Date
      },
      createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
      },
      updatedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
      },
      grnData: {
            type: [{
                  movementType: {
                        type: String,
                        required: true
                  },
                  movementIndicator: {
                        type: String,
                        required: true
                  },
                  dn: {
                        type: String,
                  },
                  dnItem: {
                        type: String,
                  },
                  po: {
                        type: String,
                        required: true
                  },
                  poItem: {
                        type: String,
                        required: true
                  },
                  material: {
                        type: String,
                        required: true
                  },
                  plant: {
                        type: String,
                        required: true
                  },
                  storageLocation: {
                        type: String,
                        required: true
                  },
                  quantity: {
                        type: Number,
                        required: true
                  },
                  netPrice: {
                        type: Number,
                        required: true
                  },
                  updatedQuantity: {
                        type: Number,
                        default: 0
                  },
                  uom: {
                        type: String,
                        required: true
                  },
                  uomIso: {
                        type: String,
                        required: true
                  }
            }],
      }
})

module.exports = mongoose.model("GRN", grnSchema)