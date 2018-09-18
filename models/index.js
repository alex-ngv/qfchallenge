const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
var   db        = {};

const sequelize = new Sequelize('qf', 'root', 'root', {
  host: 'localhost',
  // port: 8889,
  port: 5432,
  // dialect: 'mysql',
  dialect: 'postgres',
  // operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync();
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
