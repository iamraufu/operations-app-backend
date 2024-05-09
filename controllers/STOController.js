const STOTrackingModel = require('../models/STOTrackingModel')

const stoList = async (req, res) => {
      try {
            const { site, from, to } = req.body

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(
                        {
                              sign: "I",
                              site,
                              from,
                              to
                        }
                  )
            }

            const response = await fetch(`${process.env.SAP_QS}get_po.php`, requestOptions)
            const data = await response.json()

            if (data.PO_FOUND > 0) {

                  const sto = await data.PO_DOCUMENT.map(item => item.EBELN_LOW.trim())


                  const items = await data.POLINES.map(item => ({
                        sto: item.EBELN.trim(),
                        createdOnSAP: item.AEDAT.trim(),
                        supplyingPlant: data.POHEADER.find(po => po.EBELN === item.EBELN).RESWK,
                        receivingPlant: req.body.site,
                        sku: data.POLINES.filter(s => s.EBELN === item.EBELN).length
                  }))

                  let list = []

                  items.filter(item => sto.map(async sto => {

                        if (sto === item.sto && !doesObjectExistWithId(list, item.sto)) {
                              list.push(item)
                              const isAlreadySTOInTracking = await STOTrackingModel.findOne().where('sto').equals(item.sto).exec();

                              if (!isAlreadySTOInTracking) {
                                    await STOTrackingModel.create(item)
                              }
                        }
                  }))

                  function doesObjectExistWithId(array, id) {
                        // Check if any object in the array has the specified ID
                        return array.some(obj => obj.sto === id);
                  }

                  await res.status(200).json({
                        status: true,
                        message: "Successfully tracked STO and retrieved Lists",
                        data: {
                              count: data.PO_FOUND,
                              sto: list,
                        }
                  })
            }
            else if (data.PO_FOUND === 0) {
                  res.status(200).json({
                        status: false,
                        message: "No STO found"
                  })
            }
            else if (typeof data === 'string') {
                  res.status(200).json({
                        status: false,
                        message: data
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted': err}`
            })
      }
}

const multipleStoList = async (req, res) => {
      try {
            const { from, to, receivingPlant, supplyingPlant } = req.query
            const sites = receivingPlant.split(',')

            const requests = sites.map(site => {

                  const requestOptions = {
                        method: 'POST',
                        body: JSON.stringify(
                              {
                                    sign: "I",
                                    site,
                                    from,
                                    to
                              }
                        )
                  }

                  return fetch(`${process.env.SAP_QS}get_po.php`, requestOptions)
            })

            const responses = await Promise.all(requests)
            const results = responses.map(response => response.json())
            const data = await Promise.all(results)

            const count = data.reduce((accumulator, currentValue) => accumulator + currentValue.PO_FOUND, 0);
            const sto = data.map(item => item.PO_DOCUMENT.map(sto => sto.EBELN_LOW.trim())).flat();

            const items = data.map(item => item.POLINES.map(innerItem =>
            ({
                  sto: innerItem.EBELN.trim(),
                  createdOnSAP: innerItem.AEDAT.trim(),
                  supplyingPlant,
                  receivingPlant: item.IN_SITE[0].WERKS_LOW.trim(),
                  sku: item.POLINES.filter(s => s.EBELN === innerItem.EBELN).length
            })
            )).flat()

            let list = []

            items.filter(item => sto.map(async sto => {
                  if (sto === item.sto && !doesObjectExistWithId(list, item.sto)) {
                        list.push(item)
                        const isAlreadySTOInTracking = await STOTrackingModel.findOne().where('sto').equals(item.sto).exec();

                        if (!isAlreadySTOInTracking) {
                              await STOTrackingModel.create(item)
                        }
                  }
            }))

            function doesObjectExistWithId(array, sto) {
                  return array.some(obj => obj.sto === sto);
            }

            await res.status(200).json({
                  status: true,
                  message: "Successfully tracked STO and retrieved Lists",
                  data: {
                        count,
                        sto: list
                  }
            })

      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted': err}`
            })
      }
}

const stoDisplay = async (req, res) => {
      try {
            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify({ sto: req.body.sto })
            }

            const response = await fetch(`${process.env.SAP_QS}sto_display.php`, requestOptions)
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
                        message: "Successfully retrieved STO details",

                        // Previous BAPI Display Data
                        // data: {
                        //       sto: data.PO_HEADER.PO_NUMBER.trim(),
                        //       companyCode: data.PO_HEADER.CO_CODE.trim(),
                        //       documentType: data.PO_HEADER.DOC_TYPE.trim(),
                        //       createdDate: data.PO_HEADER.CREATED_ON.trim(),
                        //       createdBy: data.PO_HEADER.CREATED_BY.trim(),
                        //       documentDate: data.PO_HEADER.DOC_DATE.trim(),
                        //       supplyingPlant: data.PO_HEADER.SUPPL_PLNT.trim(),
                        //       supplyingPlantName: data.PO_ADDRESS.NAME1.trim(),
                        //       supplyingPlantAddress: `${data.PO_ADDRESS.STREET.trim()} ${data.PO_ADDRESS.CITY1.trim()} - ${data.PO_ADDRESS.POST_CODE1.trim()}`,
                        //       items: data.PO_ITEMS.map(item => (
                        //             {
                        //                   sto: item.PO_NUMBER.trim(),
                        //                   stoItem: item.PO_ITEM.trim(),
                        //                   changedOn: item.CHANGED_ON.trim(),
                        //                   material: item.MATERIAL.trim(),
                        //                   companyCode: item.CO_CODE.trim(),
                        //                   storageLocation: item.STORE_LOC.trim(),
                        //                   description: item.SHORT_TEXT.trim(),
                        //                   receivingPlant: item.PLANT.trim(),
                        //                   materialGroup: item.MAT_GRP.trim(),
                        //                   materialType: item.MAT_TYPE.trim(),
                        //                   quantity: item.QUANTITY,
                        //                   targetQuantity: item.TARGET_QTY,
                        //                   unit: item.UNIT.trim(),
                        //                   orderPricingUnit: item.ORDERPR_UN.trim(),
                        //                   stoUnit: item.PO_UNIT_ISO.trim(),
                        //                   orderPricingUnit: item.ORDERPR_UN_ISO.trim(),
                        //                   baseUom: item.BASE_UOM_ISO.trim(),
                        //                   weightUnit: item.WEIGHTUNIT_ISO.trim(),
                        //                   netPrice: item.NET_PRICE,
                        //                   pricingUnit: item.PRICE_UNIT,
                        //                   netValue: item.NET_VALUE,
                        //                   grossValue: item.GROS_VALUE,
                        //                   effectiveValue: item.EFF_VALUE,
                        //                   netWeight: item.NET_WEIGHT,
                        //                   baseWeight: item.BASE_UNIT.trim(),
                        //                   weightUnit: item.WEIGHTUNIT.trim(),
                        //                   pricingDate: item.PRICE_DATE.trim(),
                        //                   barcode: item.EAN_UPC.trim() ? item.EAN_UPC.trim() : item.MATERIAL.trim()
                        //             }
                        //       ))
                        // }

                        // Current Details from STO Display BAPI
                        data: {
                              sto: data.POHEADER.PO_NUMBER.trim(),
                              companyCode: data.POHEADER.COMP_CODE.trim(),
                              documentType: data.POHEADER.DOC_TYPE.trim(),
                              createdDate: data.POHEADER.CREAT_DATE.trim(),
                              createdBy: data.POHEADER.CREATED_BY.trim(),
                              documentDate: data.POHEADER.DOC_DATE.trim(),
                              supplyingPlant: data.POHEADER.VENDOR.trim(),
                              items: data.POITEM.map(item => (
                                    {
                                          sto: data.POHEADER.PO_NUMBER.trim(),
                                          stoItem: item.PO_ITEM.trim(),
                                          material: item.MATERIAL.trim(),
                                          description: item.SHORT_TEXT.trim(),
                                          receivingPlant: item.PLANT.trim(),
                                          storageLocation: item.STGE_LOC.trim(),
                                          quantity: item.QUANTITY,
                                          unit: item.PO_UNIT.trim(),
                                          orderPricingUnit: item.ORDERPR_UN.trim(),
                                          poUnit: item.PO_UNIT_ISO.trim(),
                                          orderPricingUnit: item.ORDERPR_UN_ISO.trim(),
                                          weightUnit: item.WEIGHTUNIT_ISO.trim(),
                                          netPrice: item.NET_PRICE,
                                          pricingUnit: item.PRICE_UNIT,
                                          weightUnit: item.WEIGHTUNIT.trim(),
                                          pricingDate: item.PRICE_DATE.trim()
                                    }
                              )),
                              history: data.POHISTORY.map(item => (
                                    {
                                          sto: item.REF_DOC_NO.trim(),
                                          stoItem: item.PO_ITEM.trim(),
                                          grn: item.MAT_DOC.trim(),
                                          grnItem: item.MATDOC_ITM.trim(),
                                          postingDate: item.PSTNG_DATE.trim(),
                                          quantity: item.QUANTITY,
                                          value: item.VAL_LOCCUR,
                                          entryDate: item.ENTRY_DATE.trim(),
                                          entryTime: item.ENTRY_TIME.trim(),
                                          material: item.MATERIAL.trim(),
                                          plant: item.PLANT.trim(),
                                          documentYear: item.DOC_YEAR.trim(),
                                          documentDate: item.DOC_DATE.trim(),
                                    }
                              )),
                              historyTotal: data.POHISTORY_TOTALS.map(item => (
                                    {
                                          stoItem: item.PO_ITEM.trim(),
                                          material: data.POITEM.find(innerItem => item.PO_ITEM.trim() === innerItem.PO_ITEM.trim()).MATERIAL.trim(),
                                          description: data.POITEM.find(innerItem => item.PO_ITEM.trim() === innerItem.PO_ITEM.trim()).SHORT_TEXT.trim(),
                                          quantity: data.POITEM.find(innerItem => item.PO_ITEM.trim() === innerItem.PO_ITEM.trim()).QUANTITY,
                                          grnQuantity: item.DELIV_QTY,
                                          value: item.VAL_GR_LOC,
                                    }
                              ))
                        }
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted': err}`
            })
      }
}

module.exports = {
      stoList,
      multipleStoList,
      stoDisplay
}