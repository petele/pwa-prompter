import { h, Component } from 'preact';

import Tab from 'bootstrap/js/dist/tab';
import { deleteAccount, changePassword, signOut } from '../../../user-manager';
import { removeLocalData } from '../../../script-manager';

class ViewLoggedIn extends Component {
  state = {
    messageClass: '',
    deleteMessage: '',
    pwChangeMessage: '',
  };
  _tabs = [];
  _tabContainer = null;

  componentDidMount() {
    const tabs = [];
    const buttons = this._tabContainer.querySelectorAll('button');
    buttons.forEach((triggerEl) => {
      const tabTrigger = new Tab(triggerEl);
      triggerEl.addEventListener('click', (event) => {
        event.preventDefault();
        tabTrigger.show();
      });
      tabs.push(tabTrigger);
    })
    this._tabs = tabs;
  }

  componentWillUnmount() {
    this._tabs.forEach((tab) => {
      tab.dispose();
    });
  }

  onDeleteAccount = async (password) => {
    const email = this.props.email;
    const result = await deleteAccount(email, password);
    if (result.success) {
      await removeLocalData();
      return;
    }
    this.setState({
      messageClass: 'text-danger',
      deleteMessage: result.message,
      pwChangeMessage: '',
    });
  }

  doChangePassword = async (passwordCurrent, passwordA, passwordB) => {
    const email = this.props.email;
    const result = await changePassword(email, passwordCurrent, passwordA, passwordB);
    this.setState({
      messageClass: result.success ? 'text-success' : 'text-danger',
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

        <ul class="nav nav-tabs" id="myTab" role="tablist" ref={el => { this._tabContainer = el }}>
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="tab-profile" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">
              Profile
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="tab-password" data-bs-target="#password" type="button" role="tab" aria-controls="password" aria-selected="false">
              Change Password
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="tab-delete" data-bs-target="#delete" type="button" role="tab" aria-controls="delete" aria-selected="false">
              Delete Account
            </button>
          </li>
        </ul>

        <div class="tab-content mt-3" id="myTabContent">

          <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="tab-profile">
            <div class="row mb-2">
              <label for="staticName" class="col-3 col-form-label">Name</label>
              <div class="col-9">
                <input type="text" readonly class="form-control-plaintext" id="staticName" value={props.displayName} />
              </div>
            </div>
            <div class="row mb-3">
              <label for="staticEmail" class="col-3 col-form-label">Email</label>
              <div class="col-9">
                <input type="email" readonly class="form-control-plaintext" id="staticEmail" value={props.email} />
              </div>
            </div>
            <div>
              <button class="btn btn-danger float-end" type="button" onClick={this.doSignOut}>
                Sign out
              </button>
            </div>
          </div>

          <div class="tab-pane fade" id="password" role="tabpanel" aria-labelledby="tab-password">
            <form onSubmit={this.submitPasswordChange}>
              <div class="row mb-2">
                <label for="currentPassword" class="col-3 col-form-label">Current</label>
                <div class="col-9">
                  <input class="form-control" type="password" id="currentPassword" required autoComplete="current-password" />
                </div>
              </div>
              <div class="row mb-2">
                <label for="newPasswordA" class="col-3 col-form-label">New</label>
                <div class="col-9">
                  <input class="form-control" type="password" id="newPasswordA" minlength="6" required autoComplete="new-password" />
                </div>
              </div>
              <div class="row mb-3">
                <label for="newPasswordB" class="col-3 col-form-label">Confirm</label>
                <div class="col-9">
                  <input class="form-control" type="password" id="newPasswordB" minlength="6" required autoComplete="new-password" />
                </div>
              </div>
              <input type="submit" class="btn btn-primary mb-3 float-end" name="Submit" value="Change" />
              <div class={state.messageClass}>
                {state.pwChangeMessage}
              </div>
            </form>

          </div>
          <div class="tab-pane fade" id="delete" role="tabpanel" aria-labelledby="tab-delete">
            <form onSubmit={this.submitDeleteAccount}>
              <div class="row mb-3">
                <label for="currentPassword" class="col-3 col-form-label">Password</label>
                <div class="col-9">
                  <input class="form-control" type="password" id="deletePassword" required autoComplete="current-password" />
                </div>
              </div>
              <input type="submit" name="Submit" class="btn btn-danger mb-3 float-end" value="Delete Account" />
              <div class={state.messageClass}>
                {state.deleteMessage}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}




export default ViewLoggedIn;
