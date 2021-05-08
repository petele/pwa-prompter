import { h } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { sync, removeLocalData} from '../../../data-layer';

const SignIn = ({isUserSignedIn}) => {

  if (isUserSignedIn) {
    return (
      <button type="button" onClick={signOut}>
        Sign out
      </button>
    );
  }

  let email = '';
  let password = '';

  const emailChange = (e) => {
    email = e.target.value;
  }
  const passwordChange = (e) => {
    password = e.target.value;
  }

  async function signIn() {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      await sync();
    } catch (ex) {
      console.warn('sign in failed', ex);
    }
  }

  async function signOut() {
    try {
      await auth.signOut();
      await removeLocalData();
    } catch (ex) {
      console.warn('sign out failed', ex);
    }
  }

  return (
    <form class={style.signIn}>
      <input type="email" id="username" autoComplete="username" onInput={emailChange} />
      <input type="password" id="password" autoComplete="current-password" onInput={passwordChange} />
      <button type="button" onClick={signIn}>
        Sign in
      </button>
    </form>
  );
}

export default SignIn;
