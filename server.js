// API REST
var app = require('express')();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

// FIREBASE
var admin = require("firebase-admin");
var serviceAccount = require("./acc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL : "https://hackupc-f2708.firebaseio.com"
});

var db = admin.database();
var users = db.ref("users");
var performancers = db.ref("performancers");
var posts = db.ref("posts");

app.get('/performancer', function(req, res) {
  try {
      performancers.on("value", function(snapshot) {
        res.send({code : 200, response : snapshot.val()});
      });
  } catch (err){}
});

app.get('/performancer/:id', function(req, res) {
  try {
      performancers.child(req.params.id).on("value", function(snapshot) {
        res.send(snapshot.val());
      });
  } catch (err){}
});

app.post('/performancer', jsonParser, function (req, res) {
    try {
      var performancer = req.body;
      var newRef = performancers.push();
      newRef.set(performancer, function(err) {
        res.send({code : 200});
      });
    } catch (err){
      console.log(err);
    }
});

app.put('/performancer/:id', jsonParser, function (req, res) {
    try {
      var performancer = req.body;
      performancers.child(req.params.id).update(performancer, function(err) {
        res.send();
      });
    } catch (err){}
});

app.get('/posts', function(req, res) {
  try {// req.params.tagId
      posts.on("value", function(snapshot) {
        res.send(snapshot.val());
      });
  } catch (err){}
});

app.post('/usuari', jsonParser, function (req, res) {
    try {
      var Usuari = req.body;
      var newRef = users.push();
      users.set(Usuari, function(err) {
        res.send();
      });
    } catch (err){}
});

app.post('/login', jsonParser, function (req, res) {
    try {
      var Usuari = req.body;
      /*users.set(Usuari, function(err) {
        res.send();
      });*/
      console.log(Usuari)
      res.send({code : 200});
    } catch (err){
      console.log(err)
    }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.listen(8989);
