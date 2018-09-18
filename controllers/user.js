const models = require('../models/index.js')
const bcrypt = require('bcrypt')

createUser = function(req, res, next) {
  if (!req.body.password || !req.body.name){
    return res.send('Please Provide Name and Password')
  }
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
