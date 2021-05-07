import { h } from 'preact';
import style from './style.css';

import SignIn from '../../components/routes/accounts/sign-in';

const Account = () => {

  document.title = 'Account - MyPrompter';

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
