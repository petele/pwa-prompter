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

import RedirectToHome from '../components/redir-to-home';

class App extends Component {

  handleRoute = (e) => {
    this.setState({
      currentURL: e.url,
      scriptID: e.current?.props?.scriptID,
    });
  }

  render(props, state) {
    return (
      <div id="app">
        <Header selectedRoute={state.currentURL} scriptID={state.scriptID} />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile path="/profile/:user" />
          <Editor path="/editor/:scriptID" />
          <RedirectToHome path="/editor/" />
          <Prompter path="/prompter/:scriptID" />
          <RedirectToHome path="/prompter/" />
          <About path="/about" />
          <Account path="/account" />
          <NotFound default />
        </Router>
      </div>
    );
  }
}

export default App;
