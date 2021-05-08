import { h } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';

const SignUp = () => {

  let email = '';
  let displayName = '';
  let passwordA = '';
  let passwordB = '';

  const emailChange = (e) => {
    email = e.target.value;
  }
  const passwordAChange = (e) => {
    passwordA = e.target.value;
  }
  const passwordBChange = (e) => {
    passwordB = e.target.value;
  }
  const displayNameChange = (e) => {
    displayName = e.target.value;
  }

  async function create() {
    if (passwordA !== passwordB) {
      console.warn('[ACCOUNT] Sign up failed. Passwords do not match');
      return;
    }
    try {
      const uCred = await auth.createUserWithEmailAndPassword(email, passwordA);
      const user = uCred.user;
      console.log('[ACCOUNT] Sign up success.');
      await user.updateProfile({displayName});
      console.log('[ACCOUNT] Updated display name', displayName);
      await user.sendEmailVerification();
      console.log('[ACCOUNT] Sent verification email.');
    } catch (ex) {
      console.warn('[ACCOUNT] Sign up failed.', ex);
    }
  }

  return (
    <form class={style.signIn}>
      <input type="email" id="email" autoComplete="email" onInput={emailChange} />
      <input type="text" id="displayName" autoComplete="name" onInput={displayNameChange} />
      <input type="password" id="passwordA" autoComplete="new-password" onInput={passwordAChange} />
      <input type="password" id="passwordB" autoComplete="new-password" onInput={passwordBChange} />
      <button type="button" onClick={create}>
        Sign up
      </button>
    </form>
  );
}

export default SignUp;
