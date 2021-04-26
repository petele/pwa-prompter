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

import { getScript, updateScript } from './data-layer';

class App extends Component {

  handleRoute = async (e) => {
    const scriptID = e.current?.props?.scriptID;
    if (scriptID) {
      getScript(scriptID).then((scriptObj) => {
        scriptObj.scriptID = scriptID;
        scriptObj.currentUrl = e.url;
        this.setState(scriptObj);
      });
    } else {
      this.setState({currentUrl: e.url});
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('app should update', nextProps, nextState);
  //   // return false;
  // }

  onChange = (newVal) => {
    console.log('onChange', newVal);
    if (!this.state.scriptID) {
      console.error('NO SCRIPT ID!', newVal);
      return;
    }
    updateScript(this.state.scriptID, newVal);
    this.setState(newVal);
  }

  render() {
    return (
      <div id="app">
        <PrompterSettingsDialog />
        <Header selectedRoute={this.state.currentUrl} scriptID={this.state.scriptID} />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile path="/profile/:user" />
          <Editor path="/editor/:scriptID" onChange={this.onChange} title={this.state.title} asQuill={this.state.asQuill} />
          <RedirectToHome path="/editor/" />
          <Prompter path="/prompter/:scriptID" onChange={this.onChange} asHTML={this.state.asHTML}  />
          <RedirectToHome path="/prompter/" />
          <About path="/about" />
          <NotFound default />
        </Router>
      </div>
    );
  }

}

export default App;
