const router = require("express").Router();
const productController = require("./controller");

const multer = require("multer");

// store
router.post("/products", multer().none(), productController.store);

module.exports = router;
