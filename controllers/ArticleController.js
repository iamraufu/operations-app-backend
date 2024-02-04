// const ArticleModel = require('../models/ArticleModel')

const products = async (req, res) => {
      const fetchData = async () => {

            try {
                  const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/get_materials.php')
                  const data = await response.json()

                  const products = data.MATNRLIST.length > 0 ? data?.MATNRLIST.map(product => (
                        {
                              code: product.MATERIAL.trim(),
                              description: product.MATL_DESC.trim()
                        }
                  )) : []

                  res.status(200).json({
                        status: true,
                        articles: products
                  })
            }
            catch (err) {
                  res.status(500).json({
                        status: false,
                        message: `${err}`
                  })
            }
      }

      fetchData()
}

const singleProduct = async (req, res) => {
      const fetchData = async () => {

            try {
                  const requestOptions = {
                        method: "POST",
                        body: JSON.stringify({
                              material: req.params.material
                        })
                  }
                  const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/get_material_description.php', requestOptions)
                  const data = await response.json()

                  if (data?.RETURN?.TYPE === 'E') {
                        res.status(404).json({
                              status: false,
                              message: `${data.RETURN.MESSAGE}`
                        })
                  }
                  else {
                        res.status(200).json({
                              status: true,
                              article: {
                                    code: req.params.material,
                                    description: data.MATERIAL_GENERAL_DATA.MATL_DESC.trim(),
                                    uom: data.MATERIAL_GENERAL_DATA.BASE_UOM.trim(),
                                    unit: data.MATERIAL_GENERAL_DATA.UNIT_OF_WT.trim(),
                                    materialGroup: data.MATERIAL_GENERAL_DATA.MATL_GROUP.trim(),
                                    materialType: data.MATERIAL_GENERAL_DATA.MATL_TYPE.trim(),
                                    barcode: data.MATERIAL_GENERAL_DATA.EAN_UPC.trim() ?
                                          data.MATERIAL_GENERAL_DATA.EAN_UPC.trim() : req.params.material
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

      fetchData()
}

module.exports = {
      products,
      singleProduct
}