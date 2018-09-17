module.exports = (sequelize, DataTypes) => {
  var Extension = sequelize.define('Extension', {
    extension_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Extension.associate = function(models) {
    models.Extension.belongsToMany(models.Video,{
        through:'VideoExtensions'
      });
  };
  return Extension;
};
