import { h } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';

const ForgotPassword = () => {

  let email = '';

  const emailChange = (e) => {
    email = e.target.value;
  }

  async function sendReset() {
    try {
      await auth.sendPasswordResetEmail(email);
      console.log('[ACCOUNT] Password reset sent');
    } catch (ex) {
      console.warn('[ACCOUNT] Password reset failed', ex);
    }
  }

  return (
    <form class={style.signIn}>
      <input type="email" id="username" autoComplete="email" onInput={emailChange} />
      <button type="button" onClick={sendReset}>
        Send recovery email
      </button>
    </form>
  );
}

export default ForgotPassword;
