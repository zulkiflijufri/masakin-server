const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const HASH_ROUND = 10;

const userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Nama harus diisi"],
      minlength: [3, "Panjang nama minimal 3 karakter"],
      maxlength: [255, "Panjang nama maksimal 255 karakter"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      require: [true, "Email harus diisi"],
      maxlength: [255, "Panjang email maksimal 255 karakter"],
    },
    password: {
      type: String,
      require: [true, "Password harus diisi"],
      maxlength: [255, "Panjang email maksimal 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

// custom validation email
userSchema.path("email").validate(
  (value) => {
    // regex
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid`
);

// custiom validation unique email
userSchema.path("email").validate(
  async (value) => {
    try {
      // (1) find email
      const count = await this.model("User").count({ email: value });

      // (2)jika `false` maka validasi gagal
      // jika `true` maka validasi berhasil
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// hash password (mongoose hook)
userSchema.pre("save", (next) => {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

// autoincrement customer_id
userSchema.plugin(AutoIncrement, {
  inc_field: "customer_id",
});

module.exports = model("User", userSchema);
