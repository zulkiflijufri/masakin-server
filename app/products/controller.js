const { response } = require("express");
const Product = require("./model");

async function store(req, res, next) {
  try {
    let payload = req.body;

    let product = new Product(payload);
    await product.save();

    return res.json(product);
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

// export for use in router
module.exports = {
  store,
};
