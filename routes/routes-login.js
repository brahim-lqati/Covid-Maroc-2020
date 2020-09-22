
const bodyParser = require('body-parser')
const express = require('express')
const userController = require('../controllers/userController');
const {validationBody} = require('../middlewares/user-validation-input');
const apiCovid = require('../controllers/apiCovidController')
const mainController = require('../controllers/mainController')
const app = express();
app.set('view engine','ejs')
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

app.route('/user/sign-up')
   .get(async(req,res) =>{
       let country;
       let data = { 
           name: '',
           email: ''
       };
       await apiCovid.getCountry().then(e => country = e);
       res.render('register',{errors: null,data: data, country: country.sort()});
   })
   .post(validationBody(),userController.register)

  // app.get('/user/profil',userController.profil)
   app.get('/test',(req,res)=>{
       res.render('home')
   })

  app.get('/toto',apiCovid.buildFlag);
   
   app.get('/',mainController.main);
   app.get('/user/profil',(req,res)=>{res.render('profil')})
   app.get('/sign_up',mainController.register);

   app.get('/search',(req,res) =>{
       res.render('filter_search');
   })

module.exports = app;