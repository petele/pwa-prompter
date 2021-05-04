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
import ConfirmDeleteDialog from '../components/confirm-delete-dialog';

import { getScript, updateScript } from './data-layer';

class App extends Component {
  updatedSettings = {};

  handleRoute = async (e) => {
    const scriptID = e.current?.props?.scriptID;
    const currentURL = e.url;

    if (!scriptID) {
      this.setState({scriptID: null, currentURL});
      return;
    }

    const newState = await getScript(scriptID);
    newState.scriptID = scriptID;
    newState.currentURL = currentURL;
    this.setState(newState);
  }

  onScriptChange = async (scriptObj) => {
    await updateScript(this.state.scriptID, scriptObj);
    this.setState(scriptObj);
  }

  render(props, state) {
    return (
      <div id="app">
        { state.currentURL === '/' &&
          <ConfirmDeleteDialog />
        }
        <Header selectedRoute={state.currentURL} scriptID={state.scriptID} />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile path="/profile/:user" />
          <Editor path="/editor/:scriptID"
            onChange={this.onScriptChange}
            title={state.title}
            asQuill={state.asQuill}
            lastUpdated={state.lastUpdated} />
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
