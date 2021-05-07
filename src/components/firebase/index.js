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
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

let _user;

auth.onAuthStateChanged((user) => {
  console.log('[FB] change', user);
  _user = user;
  if (!user) {
    return;
  }
  const uid = user.uid;
  const profile = {
    displayName: user.displayName,
    email: user.email,
    lastLogin: Date.now(),
    photoURL: user.photoURL,
  }
  const path = `userData/${uid}/profile`;
  console.log(path, profile);
  database.ref(path).update(profile);
});

export function getUser() {
  return _user;
}

export function getUserID() {
  return _user?.uid;
}

export async function saveScriptToFB(scriptID, scriptObj) {
  if (!_user) {
    return;
  }
  console.log('[FB] save script', scriptID, scriptObj);
  const uid = _user.uid;
  const path = `userData/${uid}/scripts/${scriptID}`;
  database.ref(path).set(scriptObj);
}

export async function saveScriptListToFB(list) {
  if (!_user) {
    return;
  }
  console.log('[FB] save list', list);
  const uid = _user.uid;
  const path = `userData/${uid}/scriptList`;
  database.ref(path).set(list);
}
