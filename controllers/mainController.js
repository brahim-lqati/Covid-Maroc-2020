//sign_up && sing_in routes
const apiCovid = require('../controllers/apiCovidController')
const fs = require('fs');
exports.register = (req,res) =>{
    res.render('register');
}

exports.main = async(req,res) =>{
     var json,flags;
     var countries = [];
     var index = ['confirmed','newConfirmed','deaths','newDeaths','recovered','newRecovered'];
     fs.readFile('./flag.json',(err, data) =>{
         if(err) throw err;
    if(data != '')
       flags = JSON.parse(data);
    
   
     })
     await apiCovid.buildData().then((e) => json = e)
     .catch((e) => { return res.send('problem connexion')});
     
     for(let k in json)
        countries.push(k);
    
    res.render('index',{data: json, countries: countries, index: index,flags: flags});
}