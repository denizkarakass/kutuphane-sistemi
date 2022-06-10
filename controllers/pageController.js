

const Category = require('../models/Category');

exports.getIndexPage = async(req, res) => {
    console.log(req.session.userID);
    const categories = await Category.find();
    res.status(200).render('index', {
        page_name: "index",
        categories
    });
  }

