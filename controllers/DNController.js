const STOTrackingModel = require('../models/STOTrackingModel');

const createDN = async (req, res) => {
      try {

            const { sto } = req.body

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify({ sto })
            }

            const response = await fetch(`${process.env.SAP_QS}create_dn.php`, requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E' && data?.RETURN.find(result => result.NUMBER === '001') && data?.RETURN.find(result => result.NUMBER === '051')) {
                  res.status(404).json({
                        status: false,
                        message: 'Delivery Note not created as DN cannot be created against PO'
                  })
            }

            else if (data?.RETURN[0]?.TYPE === 'E' && data?.RETURN.find(result => result.NUMBER === '001') && data?.RETURN.find(result => result.NUMBER === '420')) {
                  res.status(404).json({
                        status: false,
                        message: 'Delivery Note not created as DN has already created with this STO'
                  })
            }

            else if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: 'Delivery Note not created',
                        data: data.RETURN.map(item => ({
                              message: item.MESSAGE.trim()
                        }))
                  })
            }
            else {

                  const filter = {
                        sto
                  }

                  let STOTracking = await STOTrackingModel.findOne(filter)

                  if (!STOTracking) {

                        return res.status(404).json({
                              status: false,
                              message: `STO tracking status not updated but converted to DN`,
                              data: {
                                    dn: data.DELIVERY.trim(),
                                    items: data.CREATED_ITEMS.map(item => ({
                                          sto: item.REF_DOC.trim(),
                                          stoItem: item.REF_ITEM.trim(),
                                          dn: item.DELIV_NUMB.trim(),
                                          dnItem: item.DELIV_ITEM.trim(),
                                          material: item.MATERIAL.trim(),
                                          deliveringQuantity: item.DLV_QTY,
                                          salesQuantity: item.SALES_UNIT.trim(),
                                          salesUnitISO: item.SALES_UNIT_ISO.trim()
                                    })
                                    )
                              }
                        })
                  }
                  else {
                        STOTracking.status = "in dn"
                        STOTracking.dn = data.DELIVERY.trim()
                  }

                  await STOTracking.save()

                  res.status(200).json({
                        status: true,
                        message: `STO ${sto} converted to DN ${data.DELIVERY.trim()}`,
                        data: {
                              dn: data.DELIVERY.trim(),
                              items: data.CREATED_ITEMS.map(item => ({
                                    sto: item.REF_DOC.trim(),
                                    stoItem: item.REF_ITEM.trim(),
                                    dn: item.DELIV_NUMB.trim(),
                                    dnItem: item.DELIV_ITEM.trim(),
                                    material: item.MATERIAL.trim(),
                                    deliveringQuantity: item.DLV_QTY,
                                    salesQuantity: item.SALES_UNIT.trim(),
                                    salesUnitISO: item.SALES_UNIT_ISO.trim()
                              })
                              )
                        }
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted' : err}`
            })
      }
}

const dnDisplay = async (req, res) => {
      try {
            const { dn } = req.body

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify({ dn })
            }

            const response = await fetch(`${process.env.SAP_QS}dn_display.php`, requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: 'Delivery Note not fetched',
                        data: data.RETURN.map(item => ({
                              message: item.MESSAGE.trim()
                        }))
                  })
            }

            else if (data?.RETURN[0]?.TYPE === 'I') {
                  res.status(404).json({
                        status: false,
                        message: 'Delivery Note not fetched',
                        data: data.RETURN.map(item => ({
                              message: item.MESSAGE.trim()
                        }))
                  })
            }

            else {
                  await res.status(200).json({
                        status: true,
                        data: {
                              dn: data.ET_DELIVERY_HEADER[0].VBELN.trim(),
                              createdBy: data.ET_DELIVERY_HEADER[0].ERNAM.trim(),
                              supplyingPlant: data.ET_DELIVERY_HEADER[0].VSTEL.trim(),
                              receivingPlant: data.ET_DELIVERY_HEADER[0].KUNNR.trim(),
                              items: data.ET_DELIVERY_ITEM.map(item => (
                                    {
                                          sto: item.VGBEL.trim(),
                                          dn: item.VBELN.trim(),
                                          dnItem: item.POSNR.trim(),
                                          createdBy: item.ERNAM.trim(),
                                          supplyingPlant: data.ET_DELIVERY_HEADER[0].VSTEL.trim(),
                                          receivingPlant: data.ET_DELIVERY_HEADER[0].KUNNR.trim(),
                                          material: item.MATNR.trim(),
                                          description: item.ARKTX.trim(),
                                          quantity: item.LFIMG,
                                          unit: item.MEINS.trim()
                                    }
                              ))
                        }
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted' : err}`
            })
      }
}

module.exports = {
      createDN,
      dnDisplay
}