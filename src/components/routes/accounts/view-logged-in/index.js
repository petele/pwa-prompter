import { h, Component } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { removeLocalData } from '../../../data-layer';

class ViewLoggedIn extends Component {

  changePassword = async (passwordCurrent, passwordA, passwordB) => {
    if (passwordA !== passwordB) {
      console.warn('[ACCOUNT] Password change failed. Passwords do not match!');
      return;
    }
    try {
      const email = this.props.email;
      const uCred = await auth.signInWithEmailAndPassword(email, passwordCurrent);
      const user = uCred.user;
      user.updatePassword(passwordA);
      console.log('[ACCOUNT] Password change success.');
    } catch (ex) {
      console.warn('[ACCOUNT] Password change failed.', ex);
    }
  }

  signOut = async () => {
    try {
      await auth.signOut();
      await removeLocalData();
      console.log('[ACCOUNT] Sign out success.');
    } catch (ex) {
      console.warn('[ACCOUNT] Sign out failed.', ex);
    }
  }

  submitPasswordChange = (e) => {
    e.preventDefault();
    const form = e.srcElement;
    const current = form.querySelector('#currentPassword').value;
    const pwdA = form.querySelector('#newPasswordA').value;
    const pwdB = form.querySelector('#newPasswordB').value;
    this.changePassword(current, pwdA, pwdB);
    return false;
  }

  render(props) {
    return (
      <div>
        <h2>Profile</h2>
        <div>
          <div>
            <span class={style.label}>Name</span>
            <span class={style.value}>{props.displayName}</span>
          </div>
          <div>
            <span class={style.label}>Email</span>
            <span class={style.value}>{props.email}</span>
          </div>
        </div>
        <div>
          <button class={style.button} type="button" onClick={this.signOut}>
            Sign out
          </button>
        </div>
        <form onSubmit={this.submitPasswordChange}>
          <h2>Change Password</h2>
          <div>
            <label for="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" required autoComplete="current-password" />
          </div>
          <div>
            <label for="newPasswordA">New Password</label>
            <input type="password" id="newPasswordA" required autoComplete="new-password" />
          </div>
          <div>
            <label for="newPasswordB">Confirm Password</label>
            <input type="password" id="newPasswordB" required autoComplete="new-password" />
          </div>
          <div>
            <input type="submit" name="Submit" value="Change" />
          </div>
        </form>
      </div>
    );
  }
}




export default ViewLoggedIn;
