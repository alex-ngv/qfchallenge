const models = require('../models/index.js')
const bcrypt = require('bcrypt')
createUser = function(req, res, next) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  models.User.findOrCreate({
      where: {
        name: req.body.name,
      },
      defaults: {password: hashedPassword}
    })
    .spread((user, created) => {
      console.log(user.get({
        plain: true
      }))
      if(!created){
        res.send("User Already Exists")
        return
      }
      res.send("User Created")
    })
}

module.exports.createUser = createUser;
