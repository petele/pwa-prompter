import { h } from 'preact';
import style from './style.css';

import SignIn from '../../components/sign-in';
import { auth, database } from '../../components/firebase';


const Account = () => {

  document.title = 'Account - MyPrompter';

  auth.onAuthStateChanged((user) => {
    console.log('change', user);
    const uid = user.uid;
    const path = `userData/${uid}/profile`;
    database.ref(path).set({name: user.displayName});
  });

  return (
    <div class={style.account}>
      <h1>Account</h1>
      <p>This is the account page.</p>
      <p>
        In the future, this is where you'll log in to enable cloud sync,
        and the ability to share scripts.
      </p>
      <SignIn />
    </div>
  );
};

export default Account;
