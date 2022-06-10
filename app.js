const express = require('express');
const mongoose = require('mongoose');  // MongoDB nesne modelleme aracı | Dökümantasyon için: https://www.npmjs.com/package/mongoose
const bodyParser = require('body-parser');
const session = require('express-session'); // express-session API
const MongoStore = require('connect-mongo'); // Dökümantasyon: https://www.npmjs.com/package/connect-mongo
const methodOverride = require('method-override'); //Delete ve Put methodları kullandım | Dökümantasyon: https://www.npmjs.com/package/method-override
const { listen } = require('express/lib/application');
const pageRoute = require('./routes/pageRoutes');  
const bookRoute = require('./routes/bookRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();


//CONNECT MONGODB
mongoose.connect('mongodb+srv://damlatopcu:727302@cluster0.jgpbq.mongodb.net/?retryWrites=true&w=majority').then(()=> {console.log('Veritabanı bağlandı')});

//TEMPLATE ENGİNE
app.set("view engine","ejs");

//GLOBAL VARİABLE
global.userIN = null;


//MİDDLEWARELAR
app.use(express.static("public"));
app.use(bodyParser.json()) //Express.js req.body middleware | for parsing application/json  
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
    secret: 'my_homework',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://damlatopcu:727302@cluster0.jgpbq.mongodb.net/?retryWrites=true&w=majority' }),
  }))
app.use(
    methodOverride('_method', {
      methods: ['POST', 'GET'],  
    })
  );
  

//ROUTES
app.use('*',(req,res,next)=>{
  userIN = req.session.userID;
  next();
}); //Global userIN 
app.use('/', pageRoute ); //pageRoute'a yönlendiriyor
app.use('/books', bookRoute ); //bookRoute'a yönlendiriyor
app.use('/categories', categoryRoute ); //categoryRoute'a yönlendiriyor
app.use('/users', userRoute ); //userRoute'a yönlendiriyor



const port = 3000;
app.listen(port, ()=>{
    console.log(`Uygulama ${port} numaralı portta başlatıldı.`)
});