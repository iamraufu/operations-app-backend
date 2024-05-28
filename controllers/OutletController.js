const outlets = async (req, res) => {

      const fetchData = async () => {

            try {
                  const response = await fetch(`${process.env.SAP_QS}get_outlets.php`)
                  const data = await response.json()

                  const outlets = await data.IT_SITE.length > 0 ? await data.IT_SITE.map(outlet => (
                        {
                              code: outlet.WERKS.trim(),
                              name: outlet.NAME1.trim(),
                              address: outlet.STRAS.trim(),
                              district: outlet.ORT01.trim()
                        }
                  )) : []

                  res.status(200).json({
                        status: true,
                        outlets
                  })
            }
            catch (err) {
                  res.status(500).json({
                        status: false,
                        message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted': err}`
                  })
            }
      }

      fetchData()
}

module.exports = {
      outlets
}