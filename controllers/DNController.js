const createDN = async (req, res) => {
      try {
            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(
                        {
                              "DeliveryNoteHeader": [{
                                    "REF_DOC": req.body.sto
                              }],
                              "AuthData": [{
                                    "UserID": "rupom",
                                    "Password": "bd1975"
                              }]
                        }
                  )
            }
            const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/delivery_note.php', requestOptions)
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
            else {
                  res.status(200).json({
                        status: true,
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
                  message: `${err}`
            })
      }
}

module.exports = {
      createDN
}