import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import Editor from '../routes/editor';
import Prompter from '../routes/prompter';
import About from '../routes/about';
import Account from '../routes/account';
import NotFound from '../routes/404';

import { auth } from '../components/firebase';
import RedirectToHome from '../components/redir-to-home';

class App extends Component {

  componentDidMount() {
    this.unAuthListener = auth.onAuthStateChanged(this.authStateChanged);
  }

  componentWillUnmount() {
    if (this.unAuthListener) {
      this.unAuthListener();
    }
  }

  authStateChanged = (user) => {
    console.log('***authStateChanged', user);
    this.setState({
      uid: user?.uid,
      displayName: user?.displayName,
      email: user?.email,
    });
  }

  handleRoute = (e) => {
    this.setState({
      currentURL: e.url,
      scriptID: e.current?.props?.scriptID,
    });
  }

  render(props, state) {
    return (
      <div id="app">
        <Header selectedRoute={state.currentURL} uid={state.uid} scriptID={state.scriptID} />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile path="/profile/:user" />
          <Editor path="/editor/:scriptID" />
          <RedirectToHome path="/editor/" />
          <Prompter path="/prompter/:scriptID" />
          <RedirectToHome path="/prompter/" />
          <About path="/about" />
          <Account path="/account" uid={state.uid} email={state.email} displayName={state.displayName}  />
          <NotFound default />
        </Router>
      </div>
    );
  }
}

export default App;
