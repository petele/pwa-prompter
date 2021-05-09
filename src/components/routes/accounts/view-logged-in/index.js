import { h, Component } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { removeLocalData } from '../../../data-layer';

class ViewLoggedIn extends Component {
  state = {
    message: '',
    messageClass: '',
  };

  changePassword = async (passwordCurrent, passwordA, passwordB) => {
    if (passwordA !== passwordB) {
      console.warn('[ACCOUNT] Password change failed. Passwords do not match!');
      this.setState({
        message: 'Password change failed. Passwords do not match!',
        messageClass: 'error',
      });
      return;
    }
    try {
      const email = this.props.email;
      const uCred = await auth.signInWithEmailAndPassword(email, passwordCurrent);
      const user = uCred.user;
      await user.updatePassword(passwordA);
      this.setState({
        message: 'Password changed successfully.',
        messageClass: 'success',
      });
    } catch (ex) {
      console.warn('[ACCOUNT] Password change failed.', ex);
      this.setState({
        message: 'Password change failed. An error occured.',
        messageClass: 'error',
      });
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

  submitPasswordChange = async (e) => {
    e.preventDefault();
    const form = e.srcElement;
    const current = form.querySelector('#currentPassword');
    const pwdA = form.querySelector('#newPasswordA');
    const pwdB = form.querySelector('#newPasswordB');
    await this.changePassword(current.value, pwdA.value, pwdB.value);
    current.value = '';
    pwdA.value = '';
    pwdB.value = '';
    return false;
  }

  render(props, state) {
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
            <input type="password" id="newPasswordA" minlength="6" required autoComplete="new-password" />
          </div>
          <div>
            <label for="newPasswordB">Confirm Password</label>
            <input type="password" id="newPasswordB" minlength="6" required autoComplete="new-password" />
          </div>
          <div>
            <input type="submit" name="Submit" value="Change" />
          </div>
          <div class={state.messageClass}>
            {state.message}
          </div>
        </form>
      </div>
    );
  }
}




export default ViewLoggedIn;
