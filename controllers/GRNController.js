const createGRN = async (req, res) => {
      try {
            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(req.body)
            }
            const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/create_grn.php', requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: data.RETURN[0].MESSAGE
                  })
            }
            else {
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
                                    entryQuantity:item.ENTRY_QNT,
                                    entryUom: item.ENTRY_UOM.trim(),
                                    entryUomIso: item.ENTRY_UOM_ISO.trim(),
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
      createGRN
}