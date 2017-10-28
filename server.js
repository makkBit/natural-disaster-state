const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Victim = require('./models/victim.js');
var iplocation = require('iplocation')


mongoose.connect('mongodb://localhost:27017/victimData');

app.enable('trust proxy')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


/************ ROUTES ***********
*******************************/
app.get('/', function(req, res){
  res.sendFile('index.html');
});

app.get('/thanks', function(req, res){
  res.sendfile('./public/thanks.html');
});

app.post('/api/submit', function(req, res){
  console.log(req.body);

  let v = new Victim();
  v.name = req.body.name;
  v.need = req.body.need;
  v.members = req.body.members;
  v.address = req.body.address;
  v.location = {
    lat: req.body.lat,
    long: req.body.long
  }
  v.save(function(err){
    if(err) throw new Error(err);
    res.redirect('/thanks');
  });
  
});

//populates object from data to generate graph
var populate = function(result){
  var x = {};  
  for( var r of result){
    console.log(r.need);
    if( x.hasOwnProperty( r.need) ){
      x[r.need]++;
    }
    else{
      x[r.need] = 1;
    }
  }
  return x;
};


/* STATS ROUTES */
app.get('/stats', function(req, res){
  res.sendfile('./public/stats.html');
});

app.get('/api/chartdata', function(req, res){
  Victim.find( {} )
  .exec(function(err, result){
    if(err) throw err;
    
    var y = populate(result); 

    res.json(y);
  });
});

app.get('/stats/priority', function(req, res){
  res.sendfile('./public/priority.html')
})

app.get('/stats/location', function(req, res){
  res.sendfile('./public/location.html')
})

app.get('/api/getAllLatLong', function(req, res){
  Victim.find( {} )
  .exec(function(err, result){
    if(err) throw err;
    
    var arr = [];
    for( var r of result){
      var arr1 = [];
      arr1.push(r.address);
      arr1.push(r.location.lat);
      arr1.push(r.location.long);
      arr.push(arr1);
    }
    res.json(arr);
  });
})


app.listen(3000, function () {
  console.log('app listening on port 3000!')
})

