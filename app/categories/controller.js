const Category = require("./model");

async function destroy(req, res, next) {
  try {
    let category = await Category.findOneAndDelete({ _id: req.params.id });

    return res.json(category);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let payload = req.body;
    let category = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json(category);
  } catch (error) {
    // error yg diketahui
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    // error yg tdk diketahui
    next(error);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;
    let category = new Category(payload);
    await category.save();

    return res.json(category);
  } catch (error) {
    // error yg diketahui
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    // error yg tdk diketahui
    next(error);
  }
}

async function index(req, res, next) {
  try {
    let category = await Category.find();
    return res.json(category);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  destroy,
  update,
  store,
  index,
};
