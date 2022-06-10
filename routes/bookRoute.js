const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.route('/').post(bookController.createBook); /*Form doldurcakları için kullanıcılar post isteğini tercih ettim | bookcontroller'a yönleniyor
                                                     http://localhost:3000/books yönlendirmesi olarak gelir app.js'de bulunan routes'da öyle belirttim
router.route('/example').post(bookController.fonkBook)  =>  http://localhost:3000/books/example                                         
                                                    */
router.route('/').get(bookController.getAllBooks);
router.route('/:slug').get(bookController.getBook);
router.route('/al').post(bookController.alBook);
router.route('/et').post(bookController.etBook);
router.route('/:slug').delete(bookController.silBook);
router.route('/:slug').put(bookController.güncelleBook);





module.exports = router;