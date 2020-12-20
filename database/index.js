const mongoose = require("mongoose");

// import config
const { dbHost, dbPort, dbUser, dbPass, dbName } = require("../app/config");

// connect to mongoDB
mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

// save connect
const db = mongoose.connection;

module.exports = db;
