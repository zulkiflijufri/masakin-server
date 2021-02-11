const router = require("express").Router();
const multer = require("multer");
const categoryController = require("./controller");

// index
router.get("/categories", categoryController.index);

// store
router.post("/categories", multer().none(), categoryController.store);

// update
router.put("/categories/:id", multer().none(), categoryController.update);

// delete
router.delete("/categories/:id", categoryController.destroy);

module.exports = router;
