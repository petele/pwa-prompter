import { h, Component } from 'preact';

import { signIn, createAccount, forgotPassword } from '../../../user-manager';
import { syncWithFirebase, setupSampleScript } from '../../../script-manager';

class ViewLoggedOut extends Component {
  state = {
    mode: 'sign-in',
    title: 'Sign in',
    submitText: 'Sign in',
    message: '',
    messageClass: '',
  };

  showSignIn = () => {
    const view = {
      mode: 'sign-in',
      title: 'Sign in',
      submitText: 'Sign in',
      message: '',
      messageClass: '',
    };
    this.setState(view);
  }

  doSignIn = async (email, password) => {
    const result = await signIn(email, password);
    if (result.success) {
      await syncWithFirebase();
      return;
    }
    this.setState({
      message: result.message,
      messageClass: 'text-danger',
    });
  }

  showSignUp = () => {
    const view = {
      mode: 'sign-up',
      title: 'Sign up',
      submitText: 'Sign up',
      message: '',
      messageClass: '',
    };
    this.setState(view);
  }

  doSignUp = async (email, displayName, password) => {
    const result = await createAccount(email, password, displayName);
    if (result.success) {
      await setupSampleScript();
      return;
    }
    this.setState({
      message: result.message,
      messageClass: 'text-danger',
    });
  }

  showForgotPwd = () => {
    const view = {
      mode: 'forgot',
      title: 'Forgot password',
      submitText: 'Send',
      message: '',
      messageClass: '',
    };
    this.setState(view);
  }

  doForgotPassword = async (email) => {
    const result = await forgotPassword(email);
    const newState = {
      message: result.message,
      messageClass: result.success ? 'text-success' : 'text-danger',
    }
    this.setState(newState);
    return false;
  }

  submitForm = async (e) => {
    e.preventDefault();
    const form = e.srcElement;
    const mode = this.state.mode;
    const email = form.querySelector('#signin-email');
    if (mode === 'sign-in') {
      const password = form.querySelector('#signin-password');
      await this.doSignIn(email.value, password.value);
      email.value = '';
      password.value = '';
      return false;
    }
    if (mode === 'sign-up') {
      const passwordA = form.querySelector('#signin-password');
      const passwordB = form.querySelector('#signin-confirm');
      if (passwordA.value !== passwordB.value) {
        console.warn('[SIGN_UP] Passwords do not match');
        this.setState({
          message: 'Passwords do not match.',
          messageClass: 'error',
        });
        passwordA.value = '';
        passwordB.value = '';
        return false;
      }
      const displayName = form.querySelector('#signin-name');
      await this.doSignUp(email.value, displayName.value, passwordA.value);
      return false;
    }
    if (mode === 'forgot') {
      await this.doForgotPassword(email.value);
      email.value = '';
      return false;
    }
    console.log('submit', mode);
    return false;
  }

  render(props, state) {
    return (
      <div>
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" onClick={this.showSignIn} id="nav-sign-in-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Sign In</button>
            <button class="nav-link" onClick={this.showSignUp} id="nav-sign-up-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Sign Up</button>
            <button class="nav-link" onClick={this.showForgotPwd} id="nav-forgot-pwa-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Forgot Password</button>
          </div>
        </nav>
        <form class="mt-3" onSubmit={this.submitForm}>
          {state.mode === 'sign-up' &&
            <div class="row mb-2">
              <label for="signin-name" class="col-3 col-form-label">Name</label>
              <div class="col-8">
                <input type="text" class="form-control" id="signin-name" required autoComplete="name" />
              </div>
            </div>
          }
          <div class="row mb-2">
            <label for="signin-email" class="col-3 col-form-label">Email</label>
            <div class="col-8">
              <input type="email" class="form-control" id="signin-email" required autoComplete="email" />
            </div>
          </div>
          {state.mode === 'sign-in' &&
            <div class="row mb-2">
              <label for="signin-password" class="col-3 col-form-label">Password</label>
              <div class="col-8">
                <input type="password" class="form-control" id="signin-password" minlength="6" required autoComplete="current-password" />
              </div>
            </div>
          }
          {state.mode === 'sign-up' &&
            <div class="row mb-2">
              <label for="signin-password" class="col-3 col-form-label">Password</label>
              <div class="col-8">
                <input type="password" class="form-control" id="signin-password" minlength="6" required autoComplete="new-password" />
              </div>
            </div>
          }
          {state.mode === 'sign-up' &&
            <div class="row mb-2">
              <label for="signin-confirm" class="col-3 col-form-label">Confirm</label>
              <div class="col-8">
                <input type="password" class="form-control" id="signin-confirm" minlength="6" required autoComplete="new-password" />
              </div>
            </div>
          }
          <div>
            <input type="submit" name="Submit" class="btn btn-primary mb-3" value={state.submitText} />
          </div>
          <div class={state.messageClass}>
            {state.message}
          </div>
        </form>
      </div>
    );
  }
}

export default ViewLoggedOut;
