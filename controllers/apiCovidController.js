const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
var json = null
exports.getCountry = async () =>{
    let data = fs.readFileSync('country.json');
   if(data != ''){
    let country = (JSON.parse(data)).country;
    //console.log(country);
    return country;  
   }
   else{
    var country = [];
    var jsonCountry = {};
    await axios.get('https://www.worldometers.info/coronavirus/')
    .then((resp) =>{
        var table;
        var $ = cheerio.load(resp.data);
        table = $($('body').find('tbody').first()).find('.mt_a');
       // table.forEach(e => country.push(e));
       for(let i =0;i<table.length;i++)
          //country[i] = $(table[i]).text();
          country.push($(table[i]).text());
        jsonCountry['country'] = country;
    }).catch(err => res.send(err));

    let data = JSON.stringify(jsonCountry,null,2);
    fs.writeFile('country.json',data,(err) =>{
        if(err) throw err;
        return country.sort();
    });
   }
   
}
//get data from wor
exports.getStatistic = async (req,res)=>{
    let json = {};
    var tr;
     await axios.get('https://www.worldometers.info/coronavirus/')
         .then((resp) =>{
             var $ = cheerio.load(resp.data);
              tr = $('body').find('tbody').first();

            
            // var Tds = $(tr[0]).find('td');
            //  let j = 0;
            //  let titre = ['Cases','Deaths','Recovered'];
            //  for(let i=2; i<=7;i++){
            //      let obj = {};
            //      obj['titre'] = titre[j];
            //      obj['total'] = $(Tds[i]).text();
            //      obj['new'] = $(Tds[++i]).text();
            //      json[++j] = obj;
            //  }
               //json[index[i-2]] = $(Tds[i]).text();

         })
         .catch(err => { return null});
    // return res.send(json);
   // return res.render('index',{data: json});
         //return res.send(tr.html());
         console.log(tr.html());
         res.send('success');
}
// exports.getData = async (req,res) =>{
//     await axios.get('https://covid.hespress.com')
//     .then((res) =>{
//        var $ = cheerio.load(res.data);
//        json = {};
//        // formation general sue l'état du Maroc
//        var labels = ['casConfirmes','casExclus','recup','deces','casTraitement'];
//        var date = $($('body').find('.font-13').first()).text();
//        date = date.replace('آخر تحديث :','');
//        json['date'] = date;
//        var data1 = $('body').find('.col-lg-6');
//        var data2 =  $('body').find('.col-lg-4');
//        for(let i=0;i<2;i++){
//            let obj = {};
//            obj['titre'] = $($(data1[i]).find('h5')).text()
//            obj['total'] = $($(data1[i]).find('h4')).text();
//            obj['newDay'] = '+'+$($(data1[i]).find('.badge')).text();
//            json[labels[i]] = obj;
//        } 
//        for(let i=0;i<3;i++){
//            let obj = {};
//            obj['titre'] = $($(data2[i]).find('h5')).text();
//            obj['total'] = $($(data2[i]).find('h4')).text();
//            obj['newDay'] = '+'+$($(data2[i]).find('.badge')).text();
//            json[labels[i+2]] = obj;
//        } 
//     //Formation sur chaque province
//        var div = $('body').find('.mt-4').first().find('tbody');
//        var city = [];
//        for(let i=0;i<div.length;i++){
//           var globalCity = $(div[i]).find('tr');
//           for(let j=0;j<globalCity.length;j++){
//               var dn = {};
//               dn['city'] = $($(globalCity[j]).children()[0]).text();
//               dn['newCases'] = $($(globalCity[j]).children()[1]).text();
//               dn['newDeath'] = $($(globalCity[j]).children()[2]).text();
//               city.push(dn);
//           }
//        }
//        json['citys'] = city;

//     //Formation sur chaque région
//     var regions = [];
//     var reg = $('body').first().find('tr');
//        for(let i=0;i<12;i++){
//            var tr = {};
//            tr['region'] = $($(reg[i]).children()[0]).text();
//            tr['total'] = $($(reg[i]).children()[1]).text();
//            tr['newCases'] = $($(reg[i]).children()[2]).text();
//            tr['newDeath'] = $($(reg[i]).children()[3]).text();
//            regions.push(tr);
//        }
//        json['regions'] = regions;   
// })
//    var index = ['casConfirmes','casExclus','recup','deces'];
//    //fs.writeFileSync('brahim.json','hello wolrd');
//    return res.render('index',{data: json, index: index});
//    //return res.send(json);
// }

exports.buildData = async () =>{
   var json = {};
   await axios.get('https://www.worldometers.info/coronavirus/')
              .then((resp) =>{
                var $ = cheerio.load(resp.data);
                var Trs = $($('body').find('tbody').first()).find('tr');
                var tds,obj;
                var index = ['confirmed','newConfirmed','deaths','newDeaths','recovered','newRecovered'];
                for(let i=0; i<222; i++){
                  tds = $(Trs[i]).find('td');
                  obj = {};
                  if(i<6){
                      for(let j=0;j<6;j++){
                          obj[index[j]] = $(tds[j+2]).text();
                      }
                    json[$($(Trs[i]).find('nobr')).text()] = obj;
                  } 
                 else if(i === 6) continue;
                 else{

                    for(let j=0;j<6;j++){
                        obj[index[j]] = $(tds[j+2]).text();
                    }
                    json[$(tds[1]).text()] = obj;
                  }

                }
               
              })
              .catch((err) =>{res.status(401).json({errors: err})});
              
              return json;
            // console.log(json['World']);
}

exports.buildFlag = async(req,res) =>{
    var data = {};
    await axios.get('https://www.countryflags.io/#countries/')
               .then((res) =>{
                   var $ = cheerio.load(res.data);
                   var divs = $('body').find('.item_country');
                   var p;
                   for(let i=0; i<divs.length; i++){
                       p = $(divs[i]).find('p');
                       data[$(p[1]).text()] = $(p[0]).text();
                   }
               })
    fs.writeFileSync('flag.json',JSON.stringify(data,null,2));
}