const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
var   db        = {};

const sequelize = new Sequelize('dbs43e2mog16hm', 'wtkgoyzewggwls', 'd3e087fb6e190bc463abdde8d053dda909aa66559f7606f7f35cc3b33df5af36', {
  host: 'ec2-54-83-50-145.compute-1.amazonaws.com',
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
