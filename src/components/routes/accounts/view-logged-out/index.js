import { h, Component } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { sync } from '../../../data-layer';

class ViewLoggedOut extends Component {
  state = {
    mode: 'sign-in',
    title: 'Sign in',
    submitText: 'Sign in',
  };

  showSignIn = () => {
    const view = {
      mode: 'sign-in',
      title: 'Sign in',
      submitText: 'Sign in',
    };
    this.setState(view);
  }

  signIn = async (email, password) => {
    try {
      const uCred = await auth.signInWithEmailAndPassword(email, password);
      console.log('[ACCOUNT] Sign in succeeded', uCred.user);
      await sync();
    } catch (ex) {
      console.warn('[ACCOUNT] Sign in failed', ex);
    }
  }

  showSignUp = () => {
    const view = {
      mode: 'sign-up',
      title: 'Sign up',
      submitText: 'Sign up',
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
    } catch (ex) {
      console.warn('[ACCOUNT] Sign up failed.', ex);
    }
  }

  showForgotPwd = () => {
    const view = {
      mode: 'forgot',
      title: 'Forgot password',
      submitText: 'Send',
    };
    this.setState(view);
  }

  forgotPassword = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
      console.log('[ACCOUNT] Password reset sent');
    } catch (ex) {
      console.warn('[ACCOUNT] Password reset failed', ex);
    }
  }

  submitForm = async (e) => {
    e.preventDefault();
    const form = e.srcElement;
    const mode = this.state.mode;
    const email = form.querySelector('#signin-email').value;
    if (mode === 'sign-in') {
      const password = form.querySelector('#signin-password').value;
      return this.signIn(email, password);
    }
    if (mode === 'sign-up') {
      const passwordA = form.querySelector('#signin-password').value;
      const passwordB = form.querySelector('#signin-confirm').value;
      if (passwordA !== passwordB) {
        console.warn('[SIGN_UP] Passwords do not match');
        return false;
      }
      const displayName = form.querySelector('#signin-name').value;
      return this.signUp(email, displayName, passwordA);
    }
    if (mode === 'forgot') {
      return this.forgotPassword(email);
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
            <input type="password" id="signin-password" required autoComplete="current-password" />
          </div>
        }
        {state.mode === 'sign-up' &&
          <div>
            <label for="signin-password">Password</label>
            <input type="password" id="signin-password" required autoComplete="new-password" />
          </div>
        }
        {state.mode === 'sign-up' &&
          <div>
            <label for="signin-confirm">Confirm</label>
            <input type="password" id="signin-confirm" required autoComplete="new-password" />
          </div>
        }
        <div>
          <input type="submit" name="Submit" value={state.submitText} />
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
