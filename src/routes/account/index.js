import { h, Component} from 'preact';
import style from './style.css';

import { auth } from '../../components/firebase';
import SignIn from '../../components/routes/accounts/sign-in';

class Account extends Component {

  componentDidMount() {
    this.unAuthListener = auth.onAuthStateChanged(this.authStateChanged);
  }

  componentWillUnmount() {
    if (this.unAuthListener) {
      this.unAuthListener();
    }
  }

  authStateChanged = (user) => {
    console.log('authStateChanged', user);
    const isUserSignedIn = !!user;
    this.setState({isUserSignedIn});
  }

  render(props, state) {
    return (
      <div class={style.account}>
        <h1>Account</h1>
        <p>This is the account page.</p>
        <p>
          In the future, this is where you'll log in to enable cloud sync,
          and the ability to share scripts.
        </p>
        <SignIn isUserSignedIn={state.isUserSignedIn} />
      </div>
    );
  }
}

export default Account;
