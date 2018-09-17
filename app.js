const express = require('express'),
  app         = module.exports = express(),
  path        = require('path'),
  fs          = require('fs'),
  bodyParser  = require('body-parser'),
  ffprobeStatic = require('ffprobe-static'),
  passport    = require('passport');
                require('./controllers/utils/passport');

const user = require('./controllers/user');
const video = require('./controllers/video');
const auth = require('./controllers/utils/auth');


app.use(bodyParser.json())
app.post('/createUser',user.createUser);
app.post('/getToken',auth.getToken);
app.post('/createVideo',passport.authenticate('jwt', {session: false}),video.createVideo);
app.get('/getVideos/',passport.authenticate('jwt', {session: false}),video.getVideos);
app.get('/getVideos/:page',passport.authenticate('jwt', {session: false}),video.getVideos);
app.get('/getVideo/id/:uuid',passport.authenticate('jwt', {session: false}),video.getVideo);
app.get('/getVideos/aspectRatio/:aspectRatio',passport.authenticate('jwt', {session: false}),video.getVideosAR);


app.listen(3456)
