import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBUCT7b-BAG9jpBhP9iJyDxQbocV86hOvY",
  authDomain: "pwa-prompter.firebaseapp.com",
  databaseURL: "https://pwa-prompter-default-rtdb.firebaseio.com",
  projectId: "pwa-prompter",
  storageBucket: "pwa-prompter.appspot.com",
  messagingSenderId: "366706339590",
  appId: "1:366706339590:web:7e9b961248070264ccb887"
};

firebase.initializeApp(firebaseConfig);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
