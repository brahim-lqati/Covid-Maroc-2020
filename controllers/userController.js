const userShema = require('../models/User');
const apiCovid = require('../controllers/apiCovidController')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationBody,validationResult} = require('../middlewares/user-validation-input');
require('dotenv').config();

exports.register = async(req,res) =>{
     // validation user's input
     const errors = validationResult(req,res);
     if(!errors.isEmpty()){
       //return res.status(422).json(errors.array());
       let country;
       await apiCovid.getCountry().then((e) => country = e);
       return res.render('register',{errors: errors.array(),data: req.body,country: country.sort()})
     }
 
     else{
      
         bcrypt.hash(req.body.password,10).then((hash)=>{
             const user = new userShema({
                 name: req.body.name,
                 email: req.body.email,
                 country: req.body.country,
                 password: hash
             });
             user.save().then((response)=>{
                 // res.status(201).json({
                 //     message: "user created successfully",
                 //     result: response
                 // })
                 req.session.flash={
                     useFor: 'new user',
                     type: 'success',
                     message: 'user created successfully'
                 };
                 return res.redirect(303,'/user/profil');
             }).catch((err)=>{
                 res.status(401).json({
                     error: err
                 })
             });
        });
     }
}

exports.login = (req,res) =>{
    let currentUser;
    userShema.findOne({email: req.body.email},(err,user)=>{
        if(!user){
            return res.status(401).json({
                message: 'authentification failed',
                user: user,
                error: err
            })
        }else{
        currentUser = user;
        bcrypt.compare(req.body.password,currentUser.password,(err,response)=>{
            if(!response){
                return res.status(401).json({
                    message: 'authentification failed'
                })
            }
            else{
                let jwtToken = jwt.sign(
                    {
                        email: currentUser.email,
                        userId: currentUser._id
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '1h'}
                );
                
                res.status(201).json({
                    token: jwtToken,
                    expiresIn: '1 houre',
                    msg: currentUser
                });
            }
        })
        }
    });
}


