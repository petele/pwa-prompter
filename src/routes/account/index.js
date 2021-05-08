import { h } from 'preact';
import style from './style.css';

import SignUp from '../../components/routes/accounts/sign-up';
import SignIn from '../../components/routes/accounts/sign-in';
import SignOut from '../../components/routes/accounts/sign-out';
import ForgotPassword from '../../components/routes/accounts/forgot-password';
import ChangePassword from '../../components/routes/accounts/change-password';

const Account = ({user}) => {
  return (
    <div class={style.account}>
      <h1>Account</h1>
      <p>This is the account page.</p>
      <p>
        In the future, this is where you'll log in to enable cloud sync,
        and the ability to share scripts.
      </p>
      {!user &&
        <div>
          <SignIn />
          <SignUp />
          <ForgotPassword />
        </div>
      }
      {user &&
        <div>
          <ChangePassword user={user} />
          <SignOut user={user} />
        </div>
      }
    </div>
  );
}

export default Account;
