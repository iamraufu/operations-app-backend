const stoDisplay = async (req, res) => {
      try {
            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify({ po: req.body.sto })
            }

            const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/po_display.php', requestOptions)
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
                        message: "Successfully retrieved STO details",
                        data: {
                              sto: data.PO_HEADER.PO_NUMBER.trim(),
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
                                          sto: item.PO_NUMBER.trim(),
                                          stoItem: item.PO_ITEM.trim(),
                                          changedOn: item.CHANGED_ON.trim(),
                                          material: item.MATERIAL.trim(),
                                          companyCode: item.CO_CODE.trim(),
                                          storeLocation: item.STORE_LOC.trim(),
                                          description: item.SHORT_TEXT.trim(),
                                          receivingPlant: item.PLANT.trim(),
                                          materialGroup: item.MAT_GRP.trim(),
                                          materialType: item.MAT_TYPE.trim(),
                                          quantity: item.QUANTITY,
                                          targetQuantity: item.TARGET_QTY,
                                          unit: item.UNIT.trim(),
                                          orderPricingUnit: item.ORDERPR_UN.trim(),
                                          stoUnit: item.PO_UNIT_ISO.trim(),
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
      stoDisplay
}