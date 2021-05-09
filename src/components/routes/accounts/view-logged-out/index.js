import { h, Component } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { sync } from '../../../data-layer';

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

  signIn = async (email, password) => {
    try {
      const uCred = await auth.signInWithEmailAndPassword(email, password);
      console.log('[ACCOUNT] Sign in succeeded', uCred.user);
      await sync();
      return true;
    } catch (ex) {
      console.warn('[ACCOUNT] Sign in failed', ex);
      this.setState({
        message: ex.message || 'Login failed.',
        messageClass: 'error',
      });
    }
    return false;
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

  signUp = async (email, displayName, password) => {
    try {
      const uCred = await auth.createUserWithEmailAndPassword(email, password);
      const user = uCred.user;
      console.log('[ACCOUNT] Sign up success.');
      await user.updateProfile({displayName});
      console.log('[ACCOUNT] Updated display name', displayName);
      await user.sendEmailVerification();
      console.log('[ACCOUNT] Sent verification email.');
      return true;
    } catch (ex) {
      console.warn('[ACCOUNT] Sign up failed.', ex);
      this.setState({
        message: ex.message || 'Unable to create new account.',
        messageClass: 'error',
      });
    }
    return false;
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

  forgotPassword = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
      console.log('[ACCOUNT] Password reset sent');
      this.setState({
        message: 'Password reset email sent.',
        messageClass: '',
      });
      return true;
    } catch (ex) {
      console.warn('[ACCOUNT] Password reset failed', ex);
      this.setState({
        message: 'Unable to send password reset.',
        messageClass: 'error',
      });
    }
    return false;
  }

  submitForm = async (e) => {
    e.preventDefault();
    const form = e.srcElement;
    const mode = this.state.mode;
    const email = form.querySelector('#signin-email');
    if (mode === 'sign-in') {
      const password = form.querySelector('#signin-password');
      await this.signIn(email.value, password.value);
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
      await this.signUp(email.value, displayName.value, passwordA.value);
      return false;
    }
    if (mode === 'forgot') {
      await this.forgotPassword(email.value);
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
