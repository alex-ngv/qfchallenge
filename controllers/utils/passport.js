const passport    = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;
const models   = require('../../models/index')
const config   = require('../../config/config')

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : config.secret
    },
    function (jwtPayload, cb) {
        models.User.findById(jwtPayload.id).then(user => {
          if (!user) {
              return cb(null, false, {message: 'Incorrect email or password.'});
          }
          return cb(null, user, {
              message: 'Logged In Successfully'
          });
        })
        .catch(err => {
            return cb(err);
        });
    }
));
