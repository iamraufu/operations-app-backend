const express = require('express');
const app = express();
var cors = require('cors');
const { connectDB } = require('./database/connection');

const UserRoutes = require('./routes/UserRoutes')
const RoleRoutes = require('./routes/RoleRoutes')
const OutletRoutes = require('./routes/OutletRoutes')
const ArticleRoutes = require('./routes/ArticleRoutes')
const ProductShelvingRoutes = require('./routes/ProductShelvingRoutes')
const PORoutes = require('./routes/PORoutes')
const STORoutes = require('./routes/STORoutes')
const GRNRoutes = require('./routes/GRNRoutes')
const PendingForGRNRoutes = require('./routes/PendingForGRNRoutes')
const PendingForTPNRoutes = require('./routes/PendingForTPNRoutes')
const TempDataRoutes = require('./routes/TempDataRoutes')
const DNRoutes = require('./routes/DNRoutes')
const STOTrackingRoutes = require('./routes/STOTrackingRoutes')
const POTrackingRoutes = require('./routes/POTrackingRoutes')
const ArticleTrackingRoutes = require('./routes/ArticleTrackingRoutes')
const ChildPackingRoutes = require('./routes/ChildPackingRoutes')
const InventoryRoutes = require('./routes/InventoryRoutes')
const SMSRoutes = require('./routes/SMSRoutes')
const ServiceRoutes = require('./routes/ServiceRoutes')

require('dotenv').config()

app.use(cors(), express.json({ limit: '50mb' }))

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
      console.log(req.path, req.method);
      next();
});

app.get('/health', (req, res) => {
      res.status(200).json({
            status: true,
            message: "OK"
      })
})

app.use("/api/user", UserRoutes) // User API
app.use("/api/role", RoleRoutes) // Role API

app.use("/bapi/outlet", OutletRoutes) // Outlet API
app.use("/bapi/article", ArticleRoutes) // Article API
app.use("/bapi/po", PORoutes) // PO API
app.use("/bapi/sto", STORoutes) // STO API
app.use("/bapi/dn", DNRoutes) // DN API
app.use("/bapi/grn", GRNRoutes) // PO & STO to GRN API

app.use("/api/grn", PendingForGRNRoutes) // PO & STO to GRN API
app.use("/api/tpn", PendingForTPNRoutes) // TPN API
app.use("/api/tempData", TempDataRoutes) // TempData API

app.use('/api/product-shelving', ProductShelvingRoutes) // Product Shelving API
app.use('/api/sto-tracking', STOTrackingRoutes) // STO Tracking API
app.use('/api/po-tracking', POTrackingRoutes) // PO Tracking API
app.use('/api/article-tracking', ArticleTrackingRoutes) // Article Tracking API
app.use('/api/child-packing', ChildPackingRoutes) // Child Packing API
app.use('/api/inventory', InventoryRoutes) // Child Packing API

app.use('/api/send-sms', SMSRoutes) // SMS API

app.use('/api/service', ServiceRoutes) // Service API

connectDB()

app.listen(port, () => {
      console.log(`MongoDB connected and production backend is running on port ${port}!`);
});