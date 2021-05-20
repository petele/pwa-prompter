import { h } from 'preact';

import ViewLoggedIn from '../../components/routes/accounts/view-logged-in';
import ViewLoggedOut from '../../components/routes/accounts/view-logged-out';

const Account = ({uid, email, displayName}) => {
  return (
    <div class="container">
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Warning!</h4>
        <div>
          This app is an experiment! Data may be deleted at any time, the app
          may disappear. Use at your own risk.
        </div>
      </div>
      {uid
        ? <ViewLoggedIn email={email} displayName={displayName} />
        : <ViewLoggedOut />
      }
    </div>
  );
}

export default Account;
