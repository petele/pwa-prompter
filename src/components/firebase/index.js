import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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

let _user;

auth.onAuthStateChanged((user) => {
  console.log('[FB] auth change:', user?.uid);
  _user = user;
  if (!user) {
    return;
  }
  const path = `userData/${user.uid}/profile/lastLogin`;
  database.ref(path).set(Date.now());
});

export function getUser() {
  return _user;
}

export function getUserID() {
  return _user?.uid;
}
