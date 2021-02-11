const config = require("../config");
const Category = require("../categories/model");
const Product = require("./model");
const Tag = require("../tags/model");

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

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" }, // "i" => in case sensitive
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      // find tags
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        // merge tags with payload
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

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
      let product = await Product.findOneAndUpdate(
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

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" }, // "i" => in case sensitive
      });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      // find tags
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        // merge tags with payload
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

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

async function getById(req, res, next) {
  try {
    let productWithCategory = await Product.findOne({
      _id: req.params.id,
    }).populate("category");

    return res.json(productWithCategory);
  } catch (err) {
    next(err);
  }
}

async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0, q = "", category = "", tags = [] } = req.query;
    let criteria = {};

    // filter by name
    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } }; // "i" => incasesensitive
    }

    // filter by category (ex: "Drink")
    if (category.length) {
      category = await Category.findOne({
        name: { $regex: `${category}`, $options: "i" },
      });

      if (category) {
        criteria = { ...criteria, category: category._id };
      }
    }

    // filter by tags (ex: ['hot','cool'] or ['hot'])
    if (tags.length) {
      tags = await Tag.find({ name: { $in: tags } });
      if (tags) {
        criteria = { ...criteria, tags: { $in: tags.map((tag) => tag._id) } };
      }
    }

    let products = await Product.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("category")
      .populate("tags");

    return res.json(products);
  } catch (error) {
    next(error);
  }
}

// export for use in router
module.exports = {
  getById,
  index,
  store,
  update,
  destroy,
};
