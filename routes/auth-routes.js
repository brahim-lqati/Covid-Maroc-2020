const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const userShema = require('../models/User');
const jwt = require('jsonwebtoken');
const { response } = require('express');
const {validationBody,validationResult} = require('../middlewares/user-validation-input');
require('dotenv').config();

const app = express();
app.set('view engine','ejs')
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))
//app.use(bodyParser.json())
//Sign-Up
app.post('/user/sign-up',validationBody(),async (req,res)=>{

    // validation user's input
    const errors = validationResult(req,res);
    if(!errors.isEmpty()){
      //return res.status(422).json(errors.array());
      //return res.render('register',{errors: errors.array(),data: req.body})
      req.session.flash={
          useFor: 'input validation',
          errors: errors.array(),
          isValid: 'is-invalid'
      };
      return res.redirect('back');
    }

    else{

        bcrypt.hash(req.body.password,10).then((hash)=>{
            const user = new userShema({
                name: req.body.name,
                email: req.body.email,
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
                return res.redirect(303,'/api/user/sign-up');
            }).catch((err)=>{
                res.status(401).json({
                    error: err
                })
            });
       });
    }
});

//sign-in             
app.post('/user/sign-in',(req,res)=>{
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
});


module.exports = app;