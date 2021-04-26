import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import Editor from '../routes/editor';
import Prompter from '../routes/prompter';
import About from '../routes/about';
import NotFound from '../routes/404';

import RedirectToHome from '../components/redir-to-home';
import PrompterSettingsDialog from '../components/prompter-settings-dialog';

// import DataLayer from '../components/data-layer';

class App extends Component {

  handleRoute = async (e) => {
    const newState = {
      currentUrl: e.url,
      scriptID: e.current?.props?.scriptID,
    }
    this.setState(newState);
  }

  render() {
    return (
      <div id="app">
        <PrompterSettingsDialog open />
        <Header selectedRoute={this.state.currentUrl} scriptID={this.state.scriptID} />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile path="/profile/:user" />
          <Editor path="/editor/:scriptID" />
          <RedirectToHome path="/editor/" />
          <Prompter path="/prompter/:scriptID" />
          <RedirectToHome path="/prompter/" />
          <About path="/about" />
          <NotFound default />
        </Router>
      </div>
    );
  }

}

export default App;
