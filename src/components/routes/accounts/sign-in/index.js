import { h } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { sync, removeLocalData} from '../../../data-layer';

const SignIn = ({}) => {

  let email = '';
  let password = '';

  const emailChange = (e) => {
    email = e.target.value;
  }
  const passwordChange = (e) => {
    password = e.target.value;
  }

  async function signIn() {
    const r = await auth.signInWithEmailAndPassword(email, password);
    console.log('signed in', r);
    sync();
  }

  async function signOut() {
    const r = await auth.signOut();
    console.log('signed out', r);
    await removeLocalData();
    console.log('local data gone');
  }

  async function clearData() {
    const r = await removeLocalData();
    console.log('remove', r);
  }

  return (
    <form class={style.signIn}>
      <input type="email" id="username" autoComplete="username" onInput={emailChange} />
      <input type="password" id="password" autoComplete="current-password" onInput={passwordChange} />
      <button type="button" onClick={signIn}>
        Sign in
      </button>
      <button type="button" onClick={signOut}>
        Sign out
      </button>
      <button type="button" onClick={clearData}>
        Clear
      </button>
    </form>
  );
}

export default SignIn;
