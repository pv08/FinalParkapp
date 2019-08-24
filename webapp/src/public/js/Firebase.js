(function(){
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


  const vacancy = document.getElementById("vacancy");

  const ref = firebase.database().ref().child('Spots');
  console.log(ref);
  ref.on("value", snap => {
    var spots = snap.val();
    vacancy.innerText = JSON.stringfy(spots, null, 3);
  });
});
