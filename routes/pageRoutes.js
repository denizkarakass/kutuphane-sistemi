const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.route('/').get(pageController.getIndexPage); //pageController'da bulunan getIndexPage'e yönleniyor


module.exports = router;