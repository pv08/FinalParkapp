const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const config = require('./config');
const firebase = require('firebase');
const currentDatetime = new Date();
const defaultCars = ['Audi', 'VW', 'Fiat', 'Jaguar', 'Lamborghini', 'Toyota', 'Lexus', 'BMW', 'Chevrolet', 'Dodge']
const defaultPermissions = ['Administrator', 'Professor', 'Operator', 'Coordinator', 'Principal']
const firebaseConfig = {
  apiKey: "AIzaSyA-Uq6Zy_NXYIGO_TCzz9DL2yYuQTDdVZo",
  authDomain: "parkappdb.firebaseapp.com",
  databaseURL: "https://parkappdb.firebaseio.com",
  projectId: "parkappdb",
  storageBucket: "",
  messagingSenderId: "680252819099",
  appId: "1:680252819099:web:0296a6b525bae4b8"
};
firebase.initializeApp(firebaseConfig);
var firebaseDatabase = firebase.database();
var defaultPassword = bcrypt.hashSync('22041712', 8);





function setRandomPlate(){
  let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let plate = '';
  let number = '';
  for (var i = 0; i < 3; i++) {
    plate += char.charAt(Math.floor(Math.random() * char.length));
  }
  for (var i = 0; i < 4; i++) {
    number += Math.floor(Math.random() * 10);
  }
  let finalPlate = plate + "-" + number.toString();
  return finalPlate;
}
function setRandomModel(){
  let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let modelChar = '';
  let partNumber = '';
  for (var i = 0; i < 4; i++) {
    modelChar += char.charAt(Math.floor(Math.random() * char.length));
    partNumber += Math.floor(Math.random() * 11);
  }
  let finalModel = modelChar + partNumber.toString();
  return finalModel;

}


async function userInsert(data){
  var databaseReference = firebaseDatabase.ref('/Users/' + data.rfid);
  databaseReference.set(data, (error) => {
    if(error){
      return false;
    }
    return true
  });
};

async function userPopulationInsert(){
  var carReference = firebaseDatabase.ref('/Cars/Vago');
  var audiReference = firebaseDatabase.ref('/Cars/Default');
  var permissionReference = firebaseDatabase.ref('/Permissions/Administrator');

  carReference.on("value", (carSnap) => {
    var car = carSnap.val();
    permissionReference.on("value", (permissionSnap) => {
      var permission = permissionSnap.val();
      audiReference.on("value", (audiSnap) => {
        var audi = audiSnap.val();
        var data = [
          {
            matricula: '201510000',
            rfid: '00:00:00:00:01',
            name: 'Disponível',
            password: defaultPassword,
            car: car,
            permission: permission,
            status: true,
            creation: currentDatetime
          },
          {
            matricula: '201510846',
            rfid: '210:54:109:27:146',
            password: defaultPassword,
            name: 'Paulo Vitor Barbosa Ramos',
            car: audi,
            permission: permission,
            status: true,
            creation: currentDatetime
          }
        ];
        for (var i = 0; i < data.length; i++) {
          var databaseReference = firebaseDatabase.ref('/Users/' + data[i].rfid);
          databaseReference.set(data[i], (error) => {
            if(error){
              console.log(error)
            }
            console.log("ok");
          });
        }
      });
    });
  });
};

async function spotPopulationInsert(){
  var data = []
  var userVacancyReference = firebaseDatabase.ref('/Users/00:00:00:00:01');
  userVacancyReference.on("value", (userSnap) => {
    var user = userSnap.val();
    for (var i = 0; i < 11; i++) {
      var pusher = {
        position: i,
        user: user,
        status: true,
        creation: currentDatetime
      }
      data.push(pusher);
    }
    for (var i = 0; i < data.length; i++) {
      var databaseReference = firebaseDatabase.ref('/Spots/' + data[i].position);
      databaseReference.set(data[i], (error) => {
        if(error){
          return false;
        }
        return true
      });
      console.log(data[i]);
    }


  });

}

async function carPopulationInsert(){
  var databaseReference = firebaseDatabase.ref('/Cars/Vago');
  var defaultReference = firebaseDatabase.ref('/Cars/Default');

  var dataInsert = {
    car: '',
    model: '',
    plate: '',
    status: true,
    creation: currentDatetime
  };
  var dataDefault = {
    car: 'Audi',
    model: 'RS7',
    plate: 'AUD-0000',
    status: true,
    creation: currentDatetime
  };

  databaseReference.set(dataInsert, (error) => {
    if(error){
      return false;
    }
    return true
  });
  console.log(dataInsert);

  defaultReference.set(dataDefault, (error) => {
    if(error){
      return false;
    }
    return true
  });
  console.log(dataDefault);

  var data = [];
  for (var i = 0; i < defaultCars.length; i++) {
    pusher = {
      car: defaultCars[i],
      model: setRandomModel(),
      plate: setRandomPlate(),
      status: true,
      creation: currentDatetime
    };
    data.push(pusher);
    console.log(data[i]);
  }

  for (var i = 0; i < data.length; i++) {
    var databaseReference = firebaseDatabase.ref('/Cars/' + data[i].plate);
    databaseReference.set(data[i], (error) => {
      if(error){
        return false;
      }
      return true
    });
    console.log(data[i]);
  }

};

async function permissionPopulationInsert(){
  var data = [];
  for (var i = 0; i < defaultPermissions.length; i++) {
    var pusher = {
      permission: defaultPermissions[i],
      status: true,
      creation: currentDatetime
    }
    data.push(pusher);
  }
  for (var i = 0; i < data.length; i++) {
    var databaseReference = firebaseDatabase.ref('/Permissions/' + data[i].permission);
    databaseReference.set(data[i], (error) => {
      if(error){
        return false;
      }
      return true
    });
    console.log(data[i]);
  }

}


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "src/public")));
app.set('views', path.join(__dirname, '/src/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.post('/populate', (req, res) => {

  carPopulationInsert();
  permissionPopulationInsert();
  userPopulationInsert();
  spotPopulationInsert();
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
  res.render('./dashboard/controls.html');
});

app.get('/test', (req, res) => {
  res.render('./test.html');
})

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
