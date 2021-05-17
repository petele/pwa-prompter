import { h, Component } from 'preact';
import style from './style.scss';

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
      messageClass: style.error,
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
      messageClass: style.error,
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
      messageClass: result.success ? style.success : style.error,
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
      <form class={style.signIn} onSubmit={this.submitForm}>
        <h2>{state.title}</h2>
        <div>
          <label for="signin-email">Email</label>
          <input type="email" id="signin-email" required autoComplete="email" />
        </div>
        {state.mode === 'sign-up' &&
          <div>
            <label for="signin-name">Name</label>
            <input type="text" id="signin-name" required autoComplete="name" />
          </div>
        }
        {state.mode === 'sign-in' &&
          <div>
            <label for="signin-password">Password</label>
            <input type="password" id="signin-password" minlength="6" required autoComplete="current-password" />
          </div>
        }
        {state.mode === 'sign-up' &&
          <div>
            <label for="signin-password">Password</label>
            <input type="password" id="signin-password" minlength="6" required autoComplete="new-password" />
          </div>
        }
        {state.mode === 'sign-up' &&
          <div>
            <label for="signin-confirm">Confirm</label>
            <input type="password" id="signin-confirm" minlength="6" required autoComplete="new-password" />
          </div>
        }
        <div>
          <input type="submit" name="Submit" value={state.submitText} />
        </div>
        <div class={state.messageClass}>
          {state.message}
        </div>
        <div>
          <button type="button" onClick={this.showSignIn}>Sign In</button>
          <button type="button" onClick={this.showSignUp}>Sign Up</button>
          <button type="button" onClick={this.showForgotPwd}>Forgot Password</button>
        </div>
      </form>
    );
  }
}

export default ViewLoggedOut;
