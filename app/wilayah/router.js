const router = require("express").Router();
const wilayahController = require("./controller");

// getProvinsi
router.get("/wilayah/provinsi", wilayahController.getProvinsi);

// getKabupaten
router.get("/wilayah/kabupaten", wilayahController.getKabupaten);

// getKecamatan
router.get("/wilayah/kecamatan", wilayahController.getKecamatan);

// getKecamatan
router.get("/wilayah/desa", wilayahController.getDesa);

module.exports = router;
