import { h } from 'preact';
import style from './style.css';

import ViewLoggedIn from '../../components/routes/accounts/view-logged-in';
import ViewLoggedOut from '../../components/routes/accounts/view-logged-out';

const Account = ({uid, email, displayName}) => {
  return (
    <div class={style.account}>
      <h1>Account overview</h1>
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
