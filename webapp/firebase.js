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

function setup(){
}

exports.userPost = function(data){

  firebase.initializeApp(firebaseConfig);
  var firebaseDatabase = firebase.database();
  console.log(firebaseDatabase);
  var databaseReference = firebaseDatabase.ref('/Users/' + data.matricula);
  databaseReference.set(data, (error) => {
    if(error){
      return false;
    }
    return true
  });

}
