const POTrackingModel = require('../models/POTrackingModel')

const poList = async (req, res) => {

      try {

            const { site, from, to } = req.body

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify({
                        sign: "E",
                        site,
                        from,
                        to
                  })
            }

            const response = await fetch('http://202.74.246.133:81/sap/qs/get_po.php', requestOptions)
            const data = await response.json()

            if (data.PO_FOUND > 0) {

                  const po = await data.PO_DOCUMENT.map(item => item.EBELN_LOW.trim())

                  const items = await data.POLINES.map(item => ({
                        po: item.EBELN.trim(),
                        createdOnSAP: item.AEDAT.trim(),
                        supplyingPlant: data.POHEADER.find(po => po.EBELN === item.EBELN).RESWK.trim(),
                        receivingPlant: req.body.site,
                        sku: data.POLINES.filter(s => s.EBELN === item.EBELN).length
                  }))

                  let list = []

                  items.filter(item => po.map(async po => {

                        if (po === item.po && !doesObjectExistWithId(list, item.po)) {
                              list.push(item)
                              const isAlreadyPOInTracking = await POTrackingModel.findOne().where('po').equals(item.po).exec();

                              if (!isAlreadyPOInTracking) {
                                    await POTrackingModel.create(item)
                              }
                        }
                  }))

                  function doesObjectExistWithId(array, id) {
                        // Check if any object in the array has the specified ID
                        return array.some(obj => obj.po === id);
                  }

                  await res.status(200).json({
                        status: true,
                        message: "Successfully tracked PO and retrieved Lists",
                        data: {
                              count: data.PO_FOUND,
                              po: list,
                        }
                  })
            }
            else if(data.PO_FOUND === 0){
                  res.status(200).json({
                        status: false,
                        message: "No PO found"
                  })
            }
            else if(typeof data === 'string')
            {
                  res.status(200).json({
                        status: false,
                        message: data
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

const poDisplay = async (req, res) => {
      try {
            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify({ po: req.body.po })
            }

            const response = await fetch('http://202.74.246.133:81/sap/qs/po_display.php', requestOptions)
            const data = await response.json()

            if (data === 'Could not open connection') {
                  res.status(503).json({
                        status: false,
                        message: `${data}`
                  })
            }
            else if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: data.RETURN[0].MESSAGE
                  })
            }
            else {
                  res.status(200).json({
                        status: true,
                        message: "Successfully retrieved PO details",
                        data: {
                              po: data.PO_HEADER.PO_NUMBER.trim(),
                              companyCode: data.PO_HEADER.CO_CODE.trim(),
                              documentType: data.PO_HEADER.DOC_TYPE.trim(),
                              createdDate: data.PO_HEADER.CREATED_ON.trim(),
                              createdBy: data.PO_HEADER.CREATED_BY.trim(),
                              documentDate: data.PO_HEADER.DOC_DATE.trim(),
                              supplyingPlant: data.PO_HEADER.SUPPL_PLNT.trim(),
                              supplyingPlantName: data.PO_ADDRESS.NAME1.trim(),
                              supplyingPlantAddress: `${data.PO_ADDRESS.STREET.trim()} ${data.PO_ADDRESS.CITY1.trim()} - ${data.PO_ADDRESS.POST_CODE1.trim()}`,
                              items: data.PO_ITEMS.map(item => (
                                    {
                                          po: item.PO_NUMBER.trim(),
                                          poItem: item.PO_ITEM.trim(),
                                          changedOn: item.CHANGED_ON.trim(),
                                          material: item.MATERIAL.trim(),
                                          companyCode: item.CO_CODE.trim(),
                                          storageLocation: item.STORE_LOC.trim(),
                                          description: item.SHORT_TEXT.trim(),
                                          receivingPlant: item.PLANT.trim(),
                                          materialGroup: item.MAT_GRP.trim(),
                                          materialType: item.MAT_TYPE.trim(),
                                          quantity: item.QUANTITY,
                                          targetQuantity: item.TARGET_QTY,
                                          unit: item.UNIT.trim(),
                                          orderPricingUnit: item.ORDERPR_UN.trim(),
                                          poUnit: item.PO_UNIT_ISO.trim(),
                                          orderPricingUnit: item.ORDERPR_UN_ISO.trim(),
                                          baseUom: item.BASE_UOM_ISO.trim(),
                                          weightUnit: item.WEIGHTUNIT_ISO.trim(),
                                          netPrice: item.NET_PRICE,
                                          pricingUnit: item.PRICE_UNIT,
                                          netValue: item.NET_VALUE,
                                          grossValue: item.GROS_VALUE,
                                          effectiveValue: item.EFF_VALUE,
                                          netWeight: item.NET_WEIGHT,
                                          baseWeight: item.BASE_UNIT.trim(),
                                          weightUnit: item.WEIGHTUNIT.trim(),
                                          pricingDate: item.PRICE_DATE.trim(),
                                          barcode: item.EAN_UPC.trim() ? item.EAN_UPC.trim() : item.MATERIAL.trim()
                                    }
                              ))
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
      poList,
      poDisplay
}