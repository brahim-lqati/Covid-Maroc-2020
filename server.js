const express = require('express')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const api = require('./routes/auth-routes')
const loginRoutes = require('./routes/routes-login')
const mongoose = require('mongoose')
const db = require('./database/db')
const flashMiddleware = require('./middlewares/flash')
const port = process.env.PORT || 8080;
//MongoDb Connection

mongoose.connect(db.dbConfig,{useNewUrlParser: true, useUnifiedTopology: true}).then(
    () =>{
        console.log('database connected');
    },
    error => {
        console.log('Failed connection to Database '+error);
    }
);
mongoose.set('useCreateIndex', true); // remove MongoDb warnings
        
const app = express();
app.use(express.json());
//for session
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}))
app.use(express.static('public'))
app.use(flashMiddleware);
app.set('view engine','ejs');
//app.use('/api',api);
app.use('/',loginRoutes);



// app.get('/api/user/sign-up',(req,res) =>{
//     let data = {
//         name: '',
//         email: ''
//     }
//   res.render('register',{data:''});
// })
//for invalid routes
app.all('*',(req,res) =>{
    res.status(404).render('notFound');
})


app.listen(port,() =>{
    console.log('server running in port: '+port);
})



        