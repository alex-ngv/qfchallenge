module.exports = (sequelize, DataTypes) => {
  var Video = sequelize.define('Video', {
    video_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });



  Video.associate = function(models) {
    models.Video.belongsToMany(models.Extension,{through:'VideoExtensions'});
  };

  Video.associate = function(models) {
    models.Video.belongsToMany(models.AspectRatio,{through:'VideoAspectRatios'});
  };

  // Video.associate = function(models) {
  //   models.Video.hasOne(models.Metadata);
  // };

  return Video;
};
