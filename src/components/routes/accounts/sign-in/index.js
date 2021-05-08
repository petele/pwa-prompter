import { h } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { sync } from '../../../data-layer';

const SignIn = () => {

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
      const uCred = await auth.signInWithEmailAndPassword(email, password);
      console.log('[ACCOUNT] Sign in succeeded', uCred.user);
      await sync();
    } catch (ex) {
      console.warn('[ACCOUNT] Sign in failed', ex);
    }
  }

  return (
    <form class={style.signIn}>
      <input type="email" id="username" autoComplete="email" onInput={emailChange} />
      <input type="password" id="password" autoComplete="current-password" onInput={passwordChange} />
      <button type="button" onClick={signIn}>
        Sign in
      </button>
    </form>
  );
}

export default SignIn;
