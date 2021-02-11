const router = require("express").Router();
const multer = require("multer");
const tagController = require("./controller");

// index
router.get("/tags", tagController.index);

// store
router.post("/tags", multer().none(), tagController.store);

// update
router.put("/tags/:id", multer().none(), tagController.update);

// delete
router.delete("/tags/:id", tagController.destroy);

module.exports = router;
