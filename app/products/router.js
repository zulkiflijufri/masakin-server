const router = require("express").Router();
const productController = require("./controller");

const os = require("os");

const multer = require("multer");

// index
router.get("/products", productController.index);

// getById
router.get("/products/:id", productController.getById);

// store
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.store
);

// update
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.update
);

// delete
router.delete("/products/:id", productController.destroy);

module.exports = router;
