const mongoose = require('mongoose');  // MongoDB nesne modelleme aracı | Dökümantasyon için: https://mongoosejs.com/
const slugify = require('slugify');
const Schema = mongoose.Schema;

const BookSchema = new Schema ({
baslik: {
      type: String,
      unique: true,  //Eşsiz olmalı
      required: true  //Kullanıcının doldurması zorunlu alan
    },
desciription: {
        type: String,
        required: true  
},
yazar: {
    type: String,
    required: true 
},
isbn: {
    type: Number,
    required: true 
},
yil: {
    type: Number,
    required: true 
},
baski: {
    type: Number,
    required: true 
},
yayinci: {
    type: String,
    required: true 
},
editör: {
    type: String,
    required: true 
},
sayfa: {
    type: Number,
    required: true 
},
dili: {
    type: String,
    required: true 
},
createdAt: {
    type: Date,
    default: Date.now,
},
alDate: {
    type: Date,
    default: Date.now,
},
slug: {
    type: String,
    unique: true,
    
},
category: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category'
},
user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

//slugify
BookSchema.pre('validate', function(next){
    this.slug = slugify(this.baslik, {
      lower:true,
      strict:true
    })
    next();
  })

const Book = mongoose.model('Book',BookSchema); //Modele çevirme işlemi yaptım
module.exports = Book;