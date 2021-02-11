const Tag = require("./model");

async function destroy(req, res, next) {
  try {
    let tag = await Tag.findByIdAndDelete({ _id: req.params.id });

    return res.json(tag);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
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
