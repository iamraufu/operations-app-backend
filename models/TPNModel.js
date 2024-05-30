const mongoose = require("mongoose")

const tpnSchema = new mongoose.Schema({
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
      status: {
            type: String,
            required: true
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
      tpnData: {
            type: [{
                  movementType: {
                        type: String,
                        required: true
                  },
                  movementIndicator: {
                        type: String,
                        default: ''
                  },
                  dn: {
                        type: String,
                        required: true
                  },
                  dnItem: {
                        type: String,
                        required: true
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
                  documentQuantity: {
                        type: Number,
                        required: true
                  },
                  tpnQuantity: {
                        type: Number,
                        required: true
                  },
                  uom: {
                        type: String,
                        required: true
                  },
                  uomIso: {
                        type: String,
                        required: true
                  },
                  reportType: {
                        type: String,
                        required: true
                  },
                  damageType: {
                        type: String,
                  },
                  image: {
                        type: String
                  },
                  remarks: {
                        type: String
                  },
                  resolve: {
                        type: Boolean,
                        default: false
                  }
            }],
      }
}, {
      timestamps: true
})

module.exports = mongoose.model("TPN", tpnSchema)