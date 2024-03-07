const findOutlet = async (code) => {
      
      try {
            const response = await fetch('http://202.74.246.133:81/sap/qs/get_outlets.php')
            const data = await response.json()

            const outlets = await data.IT_SITE.length > 0 ? await data.IT_SITE.map(outlet => (
                  {
                        code: outlet.WERKS.trim(),
                        name: outlet.NAME1.trim(),
                        address: outlet.STRAS.trim(),
                        district: outlet.ORT01.trim()
                  }
            )) : []

            return await outlets.find(outlet => outlet.code === code)
      }
      catch (err) {
            return  err
      }
}

module.exports = { findOutlet }