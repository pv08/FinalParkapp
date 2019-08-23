const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const config = require('./config');
const firebase = require('firebase');


var firebaseConfig = {
  apiKey: "AIzaSyA-Uq6Zy_NXYIGO_TCzz9DL2yYuQTDdVZo",
  authDomain: "parkappdb.firebaseapp.com",
  databaseURL: "https://parkappdb.firebaseio.com",
  projectId: "parkappdb",
  storageBucket: "",
  messagingSenderId: "680252819099",
  appId: "1:680252819099:web:0296a6b525bae4b8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firebaseDatabase = firebase.database();


async function userInsert(data){
  var databaseReference = firebaseDatabase.ref('/Users/' + data.matricula);
  databaseReference.set(data, (error) => {
    if(error){
      return false;
    }
    return true
  });
}


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "src/public")));
app.set('views', path.join(__dirname, '/src/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.post('/spots/populate', (req, res) => {

  for (var i = 0; i < 11; i++) {
    var data = {
      position: i,
      status: true,
      creation: Date.now()
    };
    var databaseReference = firebaseDatabase.ref('/Spots/' + data.position);
    databaseReference.set(data, (error) => {
      if (error) return res.status(500).send(error);
      return res.status(200).send(data);
    });
  }

});

app.get('/', (req, res) => {
  res.render('./index.html');
});

app.get('/login', (req, res) => {
  res.render('./auth/login.html', {alert: false});
});
app.post('/login', (req, res) => {
  var data = {
    matricula: req.body.matricula,
    password: req.body.password
  }
  var databaseReference = firebaseDatabase.ref('/Users/' + data.matricula);
  databaseReference.on("value", (snap) => {
    var user = snap.val();
    if (user != null){
      var validPass = bcrypt.compareSync(data.password, user.password);
      if (!validPass) {
        return res.render('./auth/login.html', {alert: true});
      }else{
        let token = jwt.sign({matricula: user.matricula}, config.secret, {expiresIn: 86400});
        if (token) return res.render('./dashboard/dashboard.html', {alert: false, user: user, auth: true, token: token});
        return res.render('./auth/login.html', {alert: true});
      }
    }
    return res.render('./auth/login.html', {alert: true});
  });

});

app.get('/register', (req, res) => {
  res.render('./auth/register.html');
});

app.get('/logout', (req, res) => {
  res.redirect('/login');
});


app.get('/spots/', (req, res) => {

  var databaseReference = firebaseDatabase.ref('/Spots/');
  databaseReference.on("value", (snap) => {
    var spot = snap.val();
    if (spot != null){
      return res.render('./dashboard/controls.html', {spot_alert: false, spots: spot});
    }
    return res.render('./dashboard/controls.html', {spot_alert: true});
  });

});

app.post('/api/register', (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var data = {
    matricula: req.body.matricula,
    rfid: req.body.rfid,
    password: hashedPassword,
    car: {
      car: req.body.car,
      palte: req.body.plate,
      model:req.body.model,
      status: true,
      creation: Date.now()
    },
    permission: {
      description: "Administrator",
      status: true,
      creation: Date.now()
    }
  }
  if (userInsert(data)) {
    var token = jwt.sign({matricula: data.matricula}, config.secret, {expiresIn: 86400});
    res.render('./auth/login.html',  {auth: true, token: token, userData: data});
  }
});



var server = app.listen(3000, () =>{
  console.log("Listening at port 3000");
});
