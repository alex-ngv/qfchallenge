module.exports = (sequelize, DataTypes) => {
  var AspectRatio = sequelize.define('AspectRatio', {
    ar_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    aspectRatio: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  AspectRatio.associate = function(models) {
    models.AspectRatio.belongsToMany(models.Video, {through:"VideoAspectRatios"});
  };

  return AspectRatio;
};
