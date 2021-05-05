import { h } from 'preact';
import style from './style.css';

const Account = () => {

  document.title = 'Account - MyPrompter';

  return (
    <div class={style.account}>
      <h1>Account</h1>
      <p>This is the account page.</p>
    </div>
  );
};

export default Account;
