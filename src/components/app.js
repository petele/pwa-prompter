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
import ConfirmDeleteDialog from '../components/confirm-delete-dialog';

import { getScript, updateScript } from './data-layer';

class App extends Component {
  updatedSettings = {};

  handleRoute = async (e) => {
    const scriptID = e.current?.props?.scriptID;
    const currentURL = e.url;

    if (!scriptID) {
      this.setState({scriptID: null, currentURL});
      this.setDocTitle(null);
      return;
    }

    const newState = await getScript(scriptID);
    newState.scriptID = scriptID;
    newState.currentURL = currentURL;
    this.setState(newState);
    this.setDocTitle(newState.title);
  }

  setDocTitle = (title) => {
    document.title = title ? `${title} - MyPrompter` : `MyPrompter`;
  }

  onScriptChange = async (scriptObj) => {
    console.log('scriptUpdated', scriptObj);
    if (scriptObj.title) {
      this.setDocTitle(scriptObj.title);
    }
    await updateScript(this.state.scriptID, scriptObj);
    this.setState(scriptObj);
  }

  onSettingsChange = (key, value) => {
    this.updatedSettings[key] = value;
    this.setState(this.updatedSettings);
  }

  onSettingsClose = async () => {
    if (Object.keys(this.updatedSettings).length > 0) {
      await updateScript(this.state.scriptID, this.updatedSettings);
      this.updatedSettings = {};
    }
  }

  render(props, state) {
    return (
      <div id="app">
        { state.currentURL === '/' &&
          <ConfirmDeleteDialog />
        }
        { state.currentURL?.startsWith('/prompter/') &&
          <PrompterSettingsDialog
            eyelineHeight={state.eyelineHeight}
            scrollSpeed={state.scrollSpeed}
            autoHideFooter={state.autoHideFooter}
            fontSize={state.fontSize}
            margin={state.margin}
            lineHeight={state.lineHeight}
            allCaps={state.allCaps}
            flipHorizontal={state.flipHorizontal}
            flipVertical={state.flipVertical}
            onChange={this.onSettingsChange}
            onClose={this.onSettingsClose} />
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
          <Prompter path="/prompter/:scriptID"
            eyelineHeight={state.eyelineHeight}
            scrollSpeed={state.scrollSpeed}
            autoHideFooter={state.autoHideFooter}
            fontSize={state.fontSize}
            margin={state.margin}
            lineHeight={state.lineHeight}
            allCaps={state.allCaps}
            flipHorizontal={state.flipHorizontal}
            flipVertical={state.flipVertical}
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
