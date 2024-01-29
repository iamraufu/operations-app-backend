const PoModel = require('../models/POModel');

const poDisplay = async (req, res) => {
      try {
            const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/po_display.php', {
                  method: 'POST',
                  body: JSON.stringify({ po: req.body.po })
            })
            const data = await response.json()

            // if (data.PO_HEADER.DOC_TYPE.trim() === 'ZUB'){
            //       STO
            // }

            res.status(200).json({
                  status: true,
                  message: "Successfully retrieved PO details",
                  poDetails: {
                        po: data.PO_HEADER.PO_NUMBER.trim(),
                        documentType: data.PO_HEADER.DOC_TYPE.trim(),
                        createdDate: data.PO_HEADER.CREATED_ON.trim(),
                        createdBy: data.PO_HEADER.CREATED_BY.trim(),
                        // documentDate: data.PO_HEADER.DOC_DATE.trim(),
                        supplyingPlant: data.PO_HEADER.SUPPL_PLNT.trim(),
                        supplyingPlantName: data.PO_ADDRESS.NAME1.trim(),
                        supplyingPlantAddress: `${data.PO_ADDRESS.STREET.trim()} ${data.PO_ADDRESS.CITY1.trim()} - ${data.PO_ADDRESS.POST_CODE1.trim()}`,
                        // supplyingPlantStreet: data.PO_ADDRESS.STREET.trim(),
                        // supplyingPlantCity: data.PO_ADDRESS.CITY1.trim(),
                        // supplyingPlantPostCode: data.PO_ADDRESS.POST_CODE1.trim(),
                        items: data.PO_ITEMS.map(item => (
                              {
                                    po: item.PO_NUMBER.trim(),
                                    changedOn: item.CHANGED_ON.trim(),
                                    material: item.MATERIAL.trim(),
                                    description: item.SHORT_TEXT.trim(),
                                    receivingPlant: item.PLANT.trim(),
                                    materialGroup: item.MAT_GRP.trim(),
                                    quantity: item.QUANTITY,
                                    unit: item.UNIT.trim(),
                                    netWeight: item.NET_WEIGHT,
                                    weightUnit: item.WEIGHTUNIT.trim(),
                                    barcode: item.EAN_UPC.trim() ? item.EAN_UPC.trim() : item.MATERIAL.trim()
                              }
                        ))
                  },
                  // data
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

module.exports = {
      poDisplay
}