const POTrackingModel = require('../models/POTrackingModel');
const STOTrackingModel = require('../models/STOTrackingModel');

const POGRN = async (req, res) => {
      try {
            const po = req.body[0].po
            const bodyDetails = {
                  "GRNDocument": po,
                  "GRNData": req.body.map(item => ({
                        movementType: item.movementType,
                        movementIndicator: item.movementIndicator,
                        po: item.po,
                        poItem: item.poItem,
                        material: item.material,
                        plant: item.plant,
                        storageLocation: item.storageLocation,
                        quantity: item.quantity,
                        uom: item.uom,
                        uomIso: item.uomIso
                  }))
            }

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(bodyDetails)
            }

            const response = await fetch('http://202.74.246.133:81/sap/qs/create_grn.php', requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: data.RETURN[0].MESSAGE.trim()
                  })
            }
            else {
                  const filter = {
                        po
                  }

                  let POTracking = await POTrackingModel.findOne(filter)

                  if (POTracking === null) {
                        return res.status(404).json({
                              status: false,
                              message: `PO tracking status not updated but converted to GRN`,
                              data: {
                                    grn: data.MATERIALDOCUMENT.trim(),
                                    documentYear: data.MATDOCUMENTYEAR.trim(),
                                    items: data.GOODSMVT_ITEM.map(item => ({
                                          material: item.MATERIAL.trim(),
                                          plant: item.PLANT.trim(),
                                          storageLocation: item.STGE_LOC.trim(),
                                          movementType: item.MOVE_TYPE.trim(),
                                          entryQuantity: item.ENTRY_QNT,
                                          entryUOM: item.ENTRY_UOM.trim(),
                                          entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                          po: item.PO_NUMBER.trim(),
                                          poItem: item.PO_ITEM.trim(),
                                          movementIndicator: item.MVT_IND.trim()
                                    })
                                    )
                              }
                        })
                  }
                  else {
                        POTracking.status = "in grn"
                        POTracking.grn = data.MATERIALDOCUMENT.trim()
                  }

                  await POTracking.save()

                  res.status(200).json({
                        status: true,
                        data: {
                              grn: data.MATERIALDOCUMENT.trim(),
                              documentYear: data.MATDOCUMENTYEAR.trim(),
                              items: data.GOODSMVT_ITEM.map(item => ({
                                    material: item.MATERIAL.trim(),
                                    plant: item.PLANT.trim(),
                                    storageLocation: item.STGE_LOC.trim(),
                                    movementType: item.MOVE_TYPE.trim(),
                                    entryQuantity: item.ENTRY_QNT,
                                    entryUOM: item.ENTRY_UOM.trim(),
                                    entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                    po: item.PO_NUMBER.trim(),
                                    poItem: item.PO_ITEM.trim(),
                                    movementIndicator: item.MVT_IND.trim()
                              })
                              )
                        }
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const STOGRN = async (req, res) => {
      try {
            const sto = req.body[0].sto

            const bodyDetails = {
                  "GRNDocument": sto,
                  "GRNData": req.body.map(item => ({
                        movementType: item.movementType,
                        movementIndicator: item.movementIndicator,
                        po: item.sto,
                        poItem: item.stoItem,
                        material: item.material,
                        plant: item.plant,
                        storageLocation: item.storageLocation,
                        quantity: item.quantity,
                        uom: item.uom,
                        uomIso: item.uomIso
                  }))
            }

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(bodyDetails)
            }
            const response = await fetch('http://202.74.246.133:81/sap/qs/create_grn.php', requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: data.RETURN[0].MESSAGE.trim()
                  })
            }
            else {
                  const filter = {
                        sto
                  }

                  let STOTracking = await STOTrackingModel.findOne(filter)

                  if (STOTracking === null) {
                        return res.status(404).json({
                              status: false,
                              message: `STO tracking status not updated but converted to GRN`,
                              data: {
                                    grn: data.MATERIALDOCUMENT.trim(),
                                    documentYear: data.MATDOCUMENTYEAR.trim(),
                                    items: data.GOODSMVT_ITEM.map(item => ({
                                          material: item.MATERIAL.trim(),
                                          plant: item.PLANT.trim(),
                                          storageLocation: item.STGE_LOC.trim(),
                                          movementType: item.MOVE_TYPE.trim(),
                                          entryQuantity: item.ENTRY_QNT,
                                          entryUOM: item.ENTRY_UOM.trim(),
                                          entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                          po: item.PO_NUMBER.trim(),
                                          poItem: item.PO_ITEM.trim(),
                                          movementIndicator: item.MVT_IND.trim()
                                    })
                                    )
                              }
                        })
                  }
                  else {
                        STOTracking.status = "in grn"
                        STOTracking.grn = data.MATERIALDOCUMENT.trim()
                  }

                  await STOTracking.save()

                  res.status(200).json({
                        status: true,
                        data: {
                              grn: data.MATERIALDOCUMENT.trim(),
                              documentYear: data.MATDOCUMENTYEAR.trim(),
                              items: data.GOODSMVT_ITEM.map(item => ({
                                    material: item.MATERIAL.trim(),
                                    plant: item.PLANT.trim(),
                                    storageLocation: item.STGE_LOC.trim(),
                                    movementType: item.MOVE_TYPE.trim(),
                                    entryQuantity: item.ENTRY_QNT,
                                    entryUOM: item.ENTRY_UOM.trim(),
                                    entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                    po: item.PO_NUMBER.trim(),
                                    poItem: item.PO_ITEM.trim(),
                                    movementIndicator: item.MVT_IND.trim()
                              })
                              )
                        }
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

module.exports = {
      POGRN,
      STOGRN
}