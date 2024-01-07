require('dotenv').config()
const jwt = require('jsonwebtoken')

const tokenVerify = (req, res, next) => {
      let token = req.headers.authorization;

      if (token === undefined || token === "") {
            res.status(401).json({
                  status: false,
                  message: "Token not found"
            })
            return;
      }

      else {
            token = token.split(" ")[1]

            try {
                  const decodedData = jwt.verify(token, process.env.JWT)
                  req.user = decodedData
                  next();
            }
            catch (err) {
                  console.log(err);
                  res.status(403).json({
                        status: false,
                        message: 'Invalid Token'
                  });
            }
      }
}

module.exports = { tokenVerify }