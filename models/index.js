const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
  {
    host: "localhost",
    dialect: "mysql",
    timezone: "+9:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// db.Auth = require("./auth")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.Host = require("./host")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Option = require("./option")(sequelize, Sequelize);
db.Review = require("./review")(sequelize, Sequelize);
db.Subcategory = require("./subcategory")(sequelize, Sequelize);
db.Tag = require("./tag")(sequelize, Sequelize);
db.Tour = require("./tour")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);
db.Order = require("./order")(sequelize, Sequelize);
db.Test = require("./test")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

//mysql.server start
//npx sequelize db:create
