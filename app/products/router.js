const router = require("express").Router();
const productController = require("./controller");

const os = require("os");

const multer = require("multer");

// store
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.store
);

module.exports = router;
