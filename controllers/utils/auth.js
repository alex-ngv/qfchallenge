const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const models   = require('../../models/index')
const config   = require('../../config/config')

getToken = function(req,res,next){
  if (!req.body.password || !req.body.name){
    return res.send('Please Provide Name and Password')
  }
  models.User.findOne({ where: {name: req.body.name} }).then(user => {
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid){
      return res.status(401).send({ auth: false, token: null })
    }else{
      const token = jwt.sign({ id: user.uuid }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      return res.status(200).send({ auth: true, token: token})
    };
  // project will be the first entry of the Projects table with the title 'aProject' || null
  })
}


module.exports.getToken = getToken;
