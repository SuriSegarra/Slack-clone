import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyDD4iSF99jyhJhl3S0ErBscaANHmpC0FEI",
    authDomain: "react-slack-622cb.firebaseapp.com",
    databaseURL: "https://react-slack-622cb.firebaseio.com",
    projectId: "react-slack-622cb",
    storageBucket: "react-slack-622cb.appspot.com",
    messagingSenderId: "738997639974",
    appId: "1:738997639974:web:e73a99e9c2e4897a2effe7",
    measurementId: "G-BM1WMM77L8"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;