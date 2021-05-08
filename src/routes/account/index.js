import { h } from 'preact';
import style from './style.css';

import ViewLoggedIn from '../../components/routes/accounts/view-logged-in';
import ViewLoggedOut from '../../components/routes/accounts/view-logged-out';

const Account = ({user}) => {
  return (
    <div class={style.account}>
      <h1>Account overview</h1>
      {!user &&
        <ViewLoggedOut />
      }
      {user &&
        <ViewLoggedIn email={user.email} displayName={user.displayName} />
      }
    </div>
  );
}

export default Account;
