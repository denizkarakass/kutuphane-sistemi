const bcrypt = require('bcrypt');  //Şifreleri veritabanında şifreli tutuyoruz
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');


exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

     User.findOne({ email }, (err, user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
            req.session.userID = user._id; //user sessionlar
            res.status(200).redirect('/users/dashboard');
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};


exports.logoutUser = (req, res) => {
  req.session.destroy(()=> {
    res.redirect('/');
  })
}


exports.getDashboardPage = async(req, res) => {
  /*1)Kullanıcının id bilgilerini yakalayıp veritabanından bilgilerini  alıcam (yönetim paneli kısmında kullanmak için)
    2) Populate kullanarak kullanıcı ve kitap arasında ilişki kurucam ki user üzerinden kitap bilgilerine ulaşabileyim */ 
  const user = await User.findOne({_id:req.session.userID}).populate('books');  
  const users = await User.find();
  //console.log(req.session.userID);
  const categories = await Category.find();
  const books = await Book.find({user:req.session.userID}); /* kullanıcı id'si sessiondan kontrol edilen user ID'ye eşit olan kitapları çekiyorum
  Bu sayede kullanıcının yayınladığı kitapları onun sayfasında gösterebiliyorum. */
  res.status(200).render('dashboard', {
      page_name: "dashboard",
      categories,
      user,
      books
  });
}