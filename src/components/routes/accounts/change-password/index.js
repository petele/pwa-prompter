import { h } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';

const ChangePassword = ({user}) => {

  let passwordCurrent = '';
  let passwordA = '';
  let passwordB = '';

  const passwordCurrentChange = (e) => {
    passwordCurrent = e.target.value;
  }
  const passwordAChange = (e) => {
    passwordA = e.target.value;
  }
  const passwordBChange = (e) => {
    passwordB = e.target.value;
  }

  async function changePassword() {
    if (passwordA !== passwordB) {
      console.warn('[ACCOUNT] Password change failed. Passwords do not match!');
      return;
    }
    try {
      const email = user.email;
      const uCred = await auth.signInWithEmailAndPassword(email, passwordCurrent);
      user = uCred.user;
      user.updatePassword(passwordA);
      console.log('[ACCOUNT] Password change success.');
    } catch (ex) {
      console.warn('[ACCOUNT] Password change failed.', ex);
    }
  }

  return (
    <form>
      <input type="password" id="passwordCurrent" autoComplete="current-password" onInput={passwordCurrentChange} />
      <input type="password" id="passwordNewA" autoComplete="new-password" onInput={passwordAChange} />
      <input type="password" id="passwordNewB" autoComplete="new-password" onInput={passwordBChange} />
      <button class={style.button} type="button" onClick={changePassword}>
        Change Password
      </button>
    </form>

  );
}

export default ChangePassword;
