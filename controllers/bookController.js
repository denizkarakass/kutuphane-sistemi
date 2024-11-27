const slugify = require("slugify");
const Book = require("../models/Book");
const User = require("../models/User");
const Category = require("../models/Category");

/*
Kullanıcının kitap oluşturması için gereken fonksiyon
Async-await yapısını kullandım
Hata ile karşılaşırsam yakalamak için try-catch bloğu kullandım
Front-end tasarımını daha hazırlamamıştım bu yüzden önce json ile yazdırttım çalışmamın kontrolünün sağladım. POSTMAN uygulaması ile istekleri gönderdim.
*/
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create({
      baslik: req.body.baslik,
      desciription: req.body.desciription,
      yazar: req.body.yazar,
      isbn: req.body.isbn,
      yil: req.body.yil,
      baski: req.body.baski,
      yayinci: req.body.yayinci,
      editör: req.body.editör,
      sayfa: req.body.sayfa,
      dili: req.body.dili,
      category: req.body.category,
      user: req.session.userID, //giriş yapan kullanıcının USER ID 'sini alma session'dan alma
    });
    res.status(201).redirect("/books"); /*.json({
        status: 'success',
        book
    })*/
  } catch (error) {
    res.status(400).json({
      status: "fail in create",
      error,
    });
  }
};

/*Tüm kitapları bulup listelemek için frontend öncesi
exports.getAllBooks = async (req,res) => {
    try{
     const books = await Book.find();
     res.status(200).json({
         status: 'success',
         books
     })
    }catch(error){
     res.status(400).json({
         status: 'fail' ,
         error
     }) 
    }
 }
*/

//Tüm kitapları bulup listelemek için
exports.getAllBooks = async (req, res) => {
  try {
    const categorySlug = req.query.categories; //parmetreden gelen sorguyu aldım
    const query = req.query.search; //Kitap arama sorgusu tanımı

    const category = await Category.findOne({ name: categorySlug });

    //Filtreleme işlemi
    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }

    //Kitap arama yapma işlemi
    if (query) {
      filter = { baslik: query };
    }

    if (!query && !categorySlug) {
      (filter.baslik = ""), (filter.category = null);
    }

    const books = await Book.find({
      $or: [
        { baslik: { $regex: ".*" + filter.baslik + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-createdAt")
      .populate("user");

    const categories = await Category.find();

    res.status(200).render("books", {
      books,
      categories,
      page_name: "books",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail in getallbooks",
      error,
    });
  }
};

//Kitap sayfalarına gitmek için
exports.getBook = async (req, res) => {
  try {
    const user = await User.findById(
      req.session.userID
    ); /*Kullanıcıyı yakaladım. Eğer kullanıcı kitabı ödünç almışsa tekrar
       almaması için if koşulu yapmam gerekecek bunun için user bilgileri gerekiyordu. */
    const book = await Book.findOne({ slug: req.params.slug }).populate(
      "user"
    ); /* Populate işlemi yaptım burada kullanıcı bilgilerinide
      ulaşabilmek için  kullanma yönntemim şöyle: <%= book.user.baslik %> --> Kitabın kim tarafından oluşturulduğunu yazdırabilirim bu şekilde
      */

    const categories = await Category.find();

    res.status(200).render("book", {
      book,
      page_name: "books",
      categories,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

//Kitap alma işlemi
exports.alBook = async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug });
    const user = await User.findById(req.session.userID);
    await user.books.push({ _id: req.body.book_id }); //Kitapı almak için push methodunu kullandım
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail in all book",
      error,
    });
  }
};

//Kitap iade etme işlemi
exports.etBook = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.books.pull({ _id: req.body.book_id }); //Kitapı iade etmek için pull methodunu kullandım
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

//Kitap silme işlemi
exports.silBook = async (req, res) => {
  try {
    const book = await Book.findOneAndRemove({ slug: req.params.slug });

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

//Kitap güncelleme işlemi
exports.güncelleBook = async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug });
    book.baslik = req.body.baslik;
    book.desciription = req.body.desciription;
    book.yazar = req.body.yazar;
    book.isbn = req.body.isbn;
    book.yil = req.body.yil;
    book.baski = req.body.baski;
    book.yayinci = req.body.yayinci;
    book.editör = req.body.editör;
    book.sayfa = req.body.sayfa;
    book.dili = req.body.dili;
    book.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
