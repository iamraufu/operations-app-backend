const ArticleModel = require('../models/ArticleModel')

const products = async (req, res) => {
      const fetchData = async () => {

            try {
                  const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/get_materials.php')
                  const data = await response.json()

                  const products = data.MATNRLIST.map(product => (
                        {
                              code: product.MATERIAL.trim(),
                              description: product.MATL_DESC.trim()
                        }
                  ))

                  res.status(200).json({
                        status: true,
                        products
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
                  const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/get_material_description.php',{
                        method:"POST",
                        body: JSON.stringify({
                              material: req.params.material
                        })
                  })
                  const data = await response.json()

                  // const products = data.MATNRLIST.map(product => (
                  //       {
                  //             code: product.MATERIAL.trim(),
                  //             description: product.MATL_DESC.trim()
                  //       }
                  // ))

                  console.log(data);

                  if(data.RETURN.TYPE === 'E'){
                        res.status(404).json({
                              status: false,
                              message: `No Article Found with material code ${req.params.material}`
                        })
                  }
                  else {
                        res.status(200).json({
                              status: true,
                              data
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