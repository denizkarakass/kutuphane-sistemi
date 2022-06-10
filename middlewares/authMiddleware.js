// Giriş yapmadan yönetim paneli gibi bazı erişimi olmayan kısımlara ulaşmak isteyenler olursa diye bu middleware kısmını yazdım.

const User = require("../models/User");

module.exports = (req, res, next) => {
    User.findById(req.session.userID, (err, user) => {
      if (err || !user) return res.redirect('/');
      next();
    });
  };