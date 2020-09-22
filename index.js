const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = 3000;
var json = null;

app.get('/',async(req,res)=>{
 
    await axios.get('https://covid.hespress.com')
    .then((res) =>{
       var $ = cheerio.load(res.data);
       json = {};
       // formation general sue l'état du Maroc
       var date = $($('body').find('.font-13').first()).text();
       date = date.replace('آخر تحديث :','');
       json['date'] = date;
       var data1 = $('body').find('.col-lg-6');
       var data2 =  $('body').find('.col-lg-4');
       for(let i=0;i<2;i++){
           let obj = {};
           obj['total'] = $($(data1[i]).find('h4')).text();
           obj['newDay'] = '+'+$($(data1[i]).find('.badge')).text();
           json[$($(data1[i]).find('h5')).text()] = obj;
       } 
       for(let i=0;i<3;i++){
           let obj = {};
           obj['total'] = $($(data2[i]).find('h4')).text();
           obj['newDay'] = '+'+$($(data2[i]).find('.badge')).text();
           json[$($(data2[i]).find('h5')).text()] = obj;
       } 
    //Formation sur chaque province
       var div = $('body').find('.mt-4').first().find('tbody');
       var city = [];
       for(let i=0;i<div.length;i++){
          var globalCity = $(div[i]).find('tr');
          for(let j=0;j<globalCity.length;j++){
              var dn = {};
              dn['city'] = $($(globalCity[j]).children()[0]).text();
              dn['newCases'] = $($(globalCity[j]).children()[1]).text();
              dn['newDeath'] = $($(globalCity[j]).children()[2]).text();
              city.push(dn);
          }
       }
       json['citys'] = city;

    //Formation sur chaque région
    var regions = [];
    var reg = $('body').first().find('tr');
       for(let i=0;i<12;i++){
           var tr = {};
           tr['region'] = $($(reg[i]).children()[0]).text();
           tr['total'] = $($(reg[i]).children()[1]).text();
           tr['newCases'] = $($(reg[i]).children()[2]).text();
           tr['newDeath'] = $($(reg[i]).children()[3]).text();
           regions.push(tr);
       }
       json['regions'] = regions;   
})
    
   res.send(json);

});

app.get('/city/:q',(req,res)=>{
    if(json)
        for(let i=0;i<json.citys.length;i++){
           // console.log(json.citys[i].city+"   "+req.params.q);
           // console.log(json.citys[0].newCases);
        if(json.citys[i].city === req.params.q){
            res.send(json.citys[i]);
            return;
        }
        }
    else
        res.redirect('/');
})


app.listen(port,()=>{console.log('server running in port'+port)});
