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
        console.log(extension.get())
      })
      return video
    }).then((video) => {
      models.AspectRatio.findOrCreate({
        where: {
          aspectRatio: req.body.aspectRatio
        }
      }).spread((aspectRatio, created) => {
        aspectRatio.addVideo([video])
        console.log(aspectRatio.get())
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
      if (err){
        console.log(err)
      }else{
        console.log('Caught by logic')
      }
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
    return (data) ? res.send(data) : res.send('No Videos Found');
  }).catch((err)=>{
    console.log(err)
    if (err){
      console.log(err)
    }else{
      console.log('Caught by logic')
    }
  })
}

getVideo = function(req, res, next) {
  let payload = {}
  models.Video.findAll({
      where: {
        video_id: req.params.uuid
      }
    }).spread((data) => {
      payload.video = data
      if (!data) {
        res.send('No Matching Video Found')
        return Promise.reject()
      }
    })
    .then(() => {
      models.sequelize.query('select extension from Extensions where extension_id in (select ExtensionExtensionId from VideoExtensions where VideoVideoID = "' + req.params.uuid + '")')
        .spread((extensions) => {
          payload.extensions = extensions
        })
        .then(() => {
          models.sequelize.query('select aspectRatio from AspectRatios where ar_id in (select AspectRatioArId from VideoAspectRatios where VideoVideoID = "' + req.params.uuid + '")')
            .spread((ar) => {
              payload.aspectRatios = ar
            })
        })
        .then(() => {
          models.sequelize.query('select videoCodec,videoBitRate,audioBitRate,audioCodec from Metadata where uuid in (select MetadatumUuid from Videos where video_id = "' + req.params.uuid + '")')
            .spread((meta) => {
              payload.metadata = meta
              res.send(payload)
            })
        })
    }).catch((err)=>{
      if (err){
        console.log(err)
      }else{
        console.log('Caught by logic')
      }
    })
}

getVideosAR = function(req, res, next) {
  models.sequelize.query('select ar_id from aspectRatios where aspectRatio =  "' + req.params.aspectRatio + '"')
    .spread((ar_id) => {
      if (!Object.keys(ar_id).length){
        res.send("Aspect Ratio Not Found")
        return Promise.reject()
      }
      return id = ar_id[0].ar_id
    }).then((id) => {
      models.sequelize.query('select * from videos where video_id in(select VideoVideoID from VideoAspectRatios where AspectRatioArId ="' + id + '")')
        .spread((data) => {
          if (!data){
            return res.send("No Vidoes With Aspect Ratio "+req.params.aspectRatio+" Were Found.")
          }
          console
          res.send(data)
        })
    }).catch((err)=>{
      if (err){
        console.log(err)
      }else{
        console.log('Caught by logic')
      }
    })
}

module.exports.createVideo = createVideo;
module.exports.getVideos = getVideos;
module.exports.getVideo = getVideo;
module.exports.getVideosAR = getVideosAR;
