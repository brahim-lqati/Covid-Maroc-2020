const elasticsearch = require('elasticsearch')
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.post('/',(req,res) =>{
   client.index({
     index: "userindex",
     type: "users",
     id: req.body.id,
     body: req.body
   },(err) =>{
    if(err)
       return res.status(201).send({error: err});
    return res.status(201).send({message: "user created with success"});

   })
})
app.get('/:name',async(req,res) =>{
  const response = await client.search({
    index: "userindex",
    body:{
      query: {
        match:{
          name: req.params.name
        }
      }
    }
  },(err,resp) =>{
    if(err) return res.status(400).send({error: err});
    //return res.status(201).send(resp.hits.hits[0]._source);
  });
  
})

app.get('/search',(req,res) =>{
  res.render('filter_search');
})

app.listen(3000,() =>{
   console.log('server running in port : 3000');
})