const {body,validationResult} = require('express-validator');

module.exports = {
    validationBody: () =>{
        return  [
                    body('name','name is required')
                      .not()
                      .isEmpty(),
                    body('email','email is required')
                       .not()
                       .isEmpty()
                       .isEmail().withMessage('Invalid Email'),
                    body('password','password is required')
                       .not()
                       .isEmpty()
                       .isLength({ min: 6, max: 8 }).withMessage('Password should be between 5 to 8 characters long')
            
                ]
    },
    validationResult: (req,res) =>{
        const errors = validationResult(req);
        return errors;
    }
}