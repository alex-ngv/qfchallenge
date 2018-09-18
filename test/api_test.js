const should    = require('chai').should(),
    expect    = require('chai').expect,
    supertest = require('supertest'),
    api       = supertest('http://localhost:3456');

describe('User', function () {

    let token       = '',
        videoId     = '',
        aspectRatio = '';

    it('should give me a token',function(done){
      api.post('/getToken')
          .send({"name":"testUser","password":"pass"})
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
              token = res.body.token
              expect(res.body).to.have.property("token");
              expect(res.body.token).to.not.equal(null);
              done();
          });
    })

    it('should give me a token',function(done){
      api.post('/getToken')
          .send({"name":"testUser","password":"pass"})
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
              token = res.body.token
              expect(res.body).to.have.property("token");
              expect(res.body.token).to.not.equal(null);
              done();
          });
    })

    it('should return 5 videos',function(done){
      api.get('/getVideos')
          .set('Authorization', 'bearer '+token)
          .expect(200)
          .end(function (err, res) {
              videoId = res.body[0].video_id
              expect(res.body).to.be.an('array').to.have.lengthOf(5);
              done();
          });
    })

    it('should return a video with all the info',function(done){
      api.get('/getVideo/id/'+videoId)
          .set('Authorization', 'bearer '+token)
          .expect(200)
          .end(function (err, res) {
              aspectRatio = res.body.aspectRatios[0].aspectRatio
              expect(res.body).to.have.all.keys('video', 'extensions','aspectRatios','metadata');
              done();
          });
    })

    it('should return a vidoe with aspet ratios',function(done){
      api.get('/getVideos/aspectRatio/'+aspectRatio)
          .set('Authorization', 'bearer '+token)
          .expect(200)
          .end(function (err, res) {
              expect(res.body).to.be.an('array').that.is.not.empty;;
              done();
          });
    })

});
