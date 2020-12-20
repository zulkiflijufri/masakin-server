const router = require("express").Router();
const productController = require("./controller");

// store
router.post("/products", productController.store);

module.exports = router;
