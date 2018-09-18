const models = require('../models/index.js'),
  ffprobe = require('ffprobe'),
  ffprobeStatic = require('ffprobe-static');

//I used ffprobe to create dummy data for the DB, then when deploying I will run
//this api call to populate the data
createVideo = function(req, res, next) {
  // ffprobe(req.body.fileLocation, {
  //   path: ffprobeStatic.path
  // }, function(err, info) {
  // if (err) return err;
  models.Video.findOrCreate({
      where: {
        title: req.body.title
      },
      defaults: {
        description: req.body.description,
        author: req.body.author,
        date: Date.now(),
        duration: req.body.duration,
        source: req.body.source
      }
    }).spread((video, created) => {
      models.Extension.findOrCreate({
        where: {
          extension: req.body.extension
        }
      }).spread((extension, created) => {
        extension.addVideo([video])
        // console.log(extension.get())
      })
      return video
    }).then((video) => {
      models.AspectRatio.findOrCreate({
        where: {
          aspectRatio: req.body.aspectRatio
        }
      }).spread((aspectRatio, created) => {
        aspectRatio.addVideo([video])
        // console.log(aspectRatio.get())
      })
      return video
    }).then((video) => {
      if (!video.dataValues.MetadatumUuid) {
        return models.Metadata.create({
          'videoCodec': req.body.videoCodec,
          'videoBitRate': req.body.videoBitRate,
          'audioBitRate': req.body.audioBitRate,
          'audioCodec': req.body.audioCodec
        }).then((metadata) => {
          metadata.setVideo(video)
          return res.send('Everything Added')
        })
      }
      return res.send('Everything Added')
    }).catch((err)=>{
      console.log(err)
    })
  // })
}

getVideos = function(req, res, next) {
  let pageOffset = 0
  if (req.params.page) {
    pageOffset = (req.params.page-1) * 5
  };
  models.Video.findAll({
    offset: pageOffset,
    limit: 5,
    order: [
      ['date', 'desc']
    ]
  }).then((data) => {
    return (data) ? res.status(200).send(data) : res.status(403).send('No Videos Found');
  }).catch((err)=>{
    console.log(err)
  })
}

getVideo = function(req, res, next) {
  models.Video.findAll({
      where: {
        video_id: req.params.uuid
      },include: [{
          model: models.AspectRatio,
        },{
          model: models.Extension
        },{
          model: models.Metadata
        }]
    }).spread((data) => {
      return (data) ? res.status(200).send(data) : res.status(403).send('Vidoe Not Found');
    })
    .catch((err)=>{
      console.log(err)
    })
}

getVideosAR = function(req, res, next) {
  models.AspectRatio.findAll({
      where: {
        aspectRatio: req.params.aspectRatio
      },include: [{
          model: models.Video,
        }]
    }).spread((data) => {
      return (data) ? res.status(200).send(data) : res.status(403).send('Aspect Ratio Not Found');
    })
    .catch((err)=>{
      console.log(err)
    })
}

module.exports.createVideo = createVideo;
module.exports.getVideos = getVideos;
module.exports.getVideo = getVideo;
module.exports.getVideosAR = getVideosAR;
