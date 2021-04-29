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
import PrompterSettingsDialog from '../components/prompter-settings-dialog';

import { getScript, updateScript } from './data-layer';

class App extends Component {
  settingsDialogRef = null;

  handleRoute = async (e) => {
    const scriptID = e.current?.props?.scriptID;
    if (scriptID) {
      getScript(scriptID).then((scriptObj) => {
        scriptObj.scriptID = scriptID;
        scriptObj.currentUrl = e.url;
        this.setState(scriptObj);
      });
    } else {
      this.setState({
        scriptID: null,
        currentUrl: e.url,
        title: null,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState?.title) {
      document.title = `${nextState.title} - MyPrompter`;
    } else {
      document.title = `MyPrompter`;
    }
  }

  onChange = (newVal) => {
    console.log('onChange', newVal);
    if (!this.state.scriptID) {
      console.error('NO SCRIPT ID!', newVal);
      return;
    }
    updateScript(this.state.scriptID, newVal);
    this.setState(newVal);
  }

  showSettings = () => {
    this.settingsDialogRef.showModal();
  }

  render(props, state) {
    return (
      <div id="app">
        <PrompterSettingsDialog
          ref={el => { this.settingsDialogRef = el }} />
        <Header selectedRoute={state.currentUrl} scriptID={state.scriptID} />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile path="/profile/:user" />
          <Editor path="/editor/:scriptID"
            onChange={this.onChange}
            title={state.title}
            asQuill={state.asQuill}
            lastUpdated={state.lastUpdated} />
          <RedirectToHome path="/editor/" />
          <Prompter path="/prompter/:scriptID"
            prompterOptions={state.prompterOptions}
            onClickSettings={this.showSettings}
            asHTML={state.asHTML} />
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
