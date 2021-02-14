const Tag = require("./model");
const { policyFor } = require("../policy");

async function destroy(req, res, next) {
  try {
    let policy = policyFor(req.user);

    if (!policy.can("delete", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk menghapus tag",
      });
    }

    let tag = await Tag.findByIdAndDelete({ _id: req.params.id });

    return res.json(tag);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    let policy = policyFor(req.user);

    if (!policy.can("update", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk mengupdate tag",
      });
    }

    let payload = req.body;
    let tag = await Tag.findByIdAndUpdate({ _id: req.params.id }, payload, {
      new: true,
      runValidators: true,
    });

    return res.json(tag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(error);
  }
}

async function store(req, res, next) {
  try {
    let policy = policyFor(req.user);

    if (!policy.can("create", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk membuat tag",
      });
    }

    let payload = req.body;
    let tag = new Tag(payload);
    await tag.save();

    return res.json(tag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(error);
  }
}

async function index(req, res, next) {
  try {
    let tag = await Tag.find();

    return res.json(tag);
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
