const STOTrackingModel = require('../models/STOTrackingModel');

const createDN = async (req, res) => {
      try {

            const { sto } = req.body

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify({ sto })
            }

            const response = await fetch(`${process.env.SAP_PROD}create_dn.php`, requestOptions)
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

            const response = await fetch(`${process.env.SAP_PROD}dn_display.php`, requestOptions)
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

const dnUpdate = async (req, res) => {
      try {
            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(
                        {
                              dn: req.body.dn,
                              DNData: req.body.dnData
                        }
                  )
            }

            const response = await fetch(`${process.env.SAP_PROD}create_dn_update.php`, requestOptions)
            const data = await response.json()
            const SAPError = await data.RETURN.filter(data => data.TYPE === "E")
            const SAPSuccess = await data.RETURN.filter(data => data.TYPE === "S")
            const SAPDNUpdatedFail = await data.RETURN.filter(data => data.NUMBER === "347")
            const SAPDNUpdatedSuccessful = await data.RETURN.filter(data => data.NUMBER === "311")
            
            if(SAPError.length > 0) {
                  res.status(400).json({
                        status: false,
                        message: 'DN Quantity not edited',
                        data: SAPError.map(item => ({
                              message: item.MESSAGE.trim()
                        }))
                  })
            }

            else if(SAPDNUpdatedFail.length > 0) {
                  res.status(400).json({
                        status: false,
                        message: 'DN Quantity already edited',
                        data: SAPDNUpdatedFail.map(item => ({
                              message: item.MESSAGE.trim()
                        }))
                  })
            }

            else if(SAPDNUpdatedSuccessful.length > 0) {
                  res.status(201).json({
                        status: true,
                        message: `DN Edited`,
                        data: SAPDNUpdatedSuccessful.map(item => ({
                              message: item.MESSAGE.trim()
                        }))
                  })
            }
            
            else if(SAPSuccess.length > 0) {
                  res.status(400).json({
                        status: false,
                        message: `DN Quantity not edited`,
                        data: SAPSuccess.map(item => ({
                              message: item.MESSAGE.trim()
                        }))
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
      dnDisplay,
      dnUpdate
}