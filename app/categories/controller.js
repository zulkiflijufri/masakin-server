const Category = require("./model");
const { policyFor } = require("../policy");

async function destroy(req, res, next) {
  try {
    let policy = policyFor(req.user);

    if (!policy.can("delete", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk menghapus kategori",
      });
    }

    let category = await Category.findOneAndDelete({ _id: req.params.id });

    return res.json(category);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let policy = policyFor(req.user);

    if (!policy.can("update", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk mengupdate kategori",
      });
    }

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
    let policy = policyFor(req.user);

    if (!policy.can("create", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk membuat kategori",
      });
    }

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
