import firebase from 'firebase/compat/app';
// import 'firebase/compact/auth';
import 'firebase/compat/firestore';
// import 'firebase/compact/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAlRUn3YYz43zhLku3KKOjQALV8r4xfaQY",
  authDomain: "childregistration.firebaseapp.com",
  projectId: "childregistration",
  storageBucket: "childregistration.appspot.com",
  messagingSenderId: "441684774816",
  appId: "1:441684774816:web:ab5c20cab59abbd11c9ec5",
  measurementId: "G-BEFND1ESKQ"
};

if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
export {firebase};