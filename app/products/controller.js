const config = require("../config");
const Product = require("./model");

const path = require("path");
const fs = require("fs");

async function destroy(req, res, next) {
  try {
    let product = await Product.findOneAndDelete({ _id: req.params.id });
    let currentImg = `${config.rootPath}/public/upload/${product.image_url}`;

    // check img exist
    if (fs.existsSync(currentImg)) {
      // delete img
      fs.unlinkSync(currentImg);
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${filename}`
      );

      // read tmp file
      const src = fs.createReadStream(tmp_path);
      // move file to permanent location
      const dest = fs.createWriteStream(target_path);
      // start move file
      src.pipe(dest);

      src.on("end", async () => {
        // get product by id
        let product = await Product.findOne({ _id: req.params.id });
        // get img
        let currentImg = `${config.rootPath}/public/upload/${product.image_url}`;

        // check img exist
        if (fs.existsSync(currentImg)) {
          // delete img
          fs.unlinkSync(currentImg);
        }

        product = await Product.findByIdAndUpdate(
          { _id: req.params.id },
          { ...payload, image_url: filename },
          {
            new: true,
            runValidators: true,
          }
        );

        return res.json(product);
      });

      src.on("error", async () => {
        next(error);
      });
    } else {
      let product = new Product.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/${filename}`
      );

      // read tmp file
      const src = fs.createReadStream(tmp_path);
      // move file to permanent location
      const dest = fs.createWriteStream(target_path);
      // start move file
      src.pipe(dest);

      src.on("end", async () => {
        let product = new Product({ ...payload, image_url: filename });
        await product.save();
        return res.json(product);
      });

      src.on("error", async () => {
        next(error);
      });
    } else {
      let product = new Product(payload);
      await product.save();

      return res.json(product);
    }
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }

    next(error);
  }
}

async function index(req, res, next) {
  try {
    const { limit = 10, skip = 0 } = req.query;
    let products = await Product.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    return res.json(products);
  } catch (error) {
    next(error);
  }
}

// export for use in router
module.exports = {
  index,
  store,
  update,
  destroy,
};
