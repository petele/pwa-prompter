import { h, Component } from 'preact';
import style from './style.scss';

import { deleteAccount, changePassword, signOut } from '../../../user-manager';
import { removeLocalData } from '../../../script-manager';

class ViewLoggedIn extends Component {
  state = {
    messageClass: '',
    deleteMessage: '',
    pwChangeMessage: '',
  };

  onDeleteAccount = async (password) => {
    const email = this.props.email;
    const result = await deleteAccount(email, password);
    if (result.success) {
      await removeLocalData();
      return;
    }
    this.setState({
      messageClass: style.error,
      deleteMessage: result.message,
      pwChangeMessage: '',
    });
  }

  doChangePassword = async (passwordCurrent, passwordA, passwordB) => {
    const email = this.props.email;
    const result = await changePassword(email, passwordCurrent, passwordA, passwordB);
    this.setState({
      messageClass: result.success ? style.success : style.error,
      deleteMessage: '',
      pwChangeMessage: result.message,
    });
  }

  doSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      await removeLocalData();
    }
  }

  submitPasswordChange = async (e) => {
    e.preventDefault();
    const form = e.srcElement;
    const current = form.querySelector('#currentPassword');
    const pwdA = form.querySelector('#newPasswordA');
    const pwdB = form.querySelector('#newPasswordB');
    await this.doChangePassword(current.value, pwdA.value, pwdB.value);
    current.value = '';
    pwdA.value = '';
    pwdB.value = '';
    return false;
  }

  submitDeleteAccount = async (e) => {
    e.preventDefault();
    const form = e.srcElement;
    const current = form.querySelector('#deletePassword');
    await this.onDeleteAccount(current.value);
    current.value = '';
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
          <button class={style.button} type="button" onClick={this.doSignOut}>
            Sign out
          </button>
        </div>
        <form onSubmit={this.submitDeleteAccount}>
          <h2>Delete my account</h2>
          <div>
            <label for="currentPassword">Confirm password</label>
            <input type="password" id="deletePassword" required autoComplete="current-password" />
          </div>
          <div>
            <input type="submit" name="Submit" value="Delete Account" />
          </div>
          <div class={state.messageClass}>
            {state.deleteMessage}
          </div>
        </form>
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
            {state.pwChangeMessage}
          </div>
        </form>
      </div>
    );
  }
}




export default ViewLoggedIn;
