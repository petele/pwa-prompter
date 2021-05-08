import { h } from 'preact';
import style from './style.css';
import { Link } from 'preact-router/match';

import ViewLoggedIn from '../../components/routes/accounts/view-logged-in';
import ViewLoggedOut from '../../components/routes/accounts/view-logged-out';

const Account = ({uid, email, displayName}) => {
  return (
    <div class={style.account}>
      <h1>Account overview</h1>
      <div>WARNING</div>
      <div>
        This app is an experiment! Data may be deleted at any time, the app
        may disappear. Use at your own risk.
      </div>
      <p>
        About <Link href="/about">MyPrompter</Link>
      </p>
      {!uid &&
        <ViewLoggedOut />
      }
      {uid &&
        <ViewLoggedIn email={email} displayName={displayName} />
      }
    </div>
  );
}

export default Account;
