module.exports = (sequelize, DataTypes) => {
  var Metadata = sequelize.define('Metadata', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    videoCodec: {
      type: DataTypes.STRING,
      allowNull: false
    },
    videoBitRate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    audioBitRate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    audioCodec: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Metadata.associate = function(models) {
    models.Metadata.belongsTo(models.Video);
  };

  return Metadata;
};
