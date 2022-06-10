const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  //Kullanıcıdan aldığımız şifreleri veritabanında şifreli olarak tutmak için
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
      type:String,
      required: true
  },
  books:[{  //Kullanıcının kitaplar ile ilişkisini kuruyorum ödünç alması ve iade etmesi için
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }]
});


//Kullanıcıdan aldığımız şifreyi şifreleme işlemi
UserSchema.pre('save', function (next){
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
      user.password = hash;
      next();
  })
})

const User = mongoose.model('User', UserSchema);
module.exports = User;