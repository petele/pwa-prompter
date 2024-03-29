import { h, Component } from 'preact';
import { route } from 'preact-router';

import PrompterFooter from '../../components/routes/prompter/prompter-footer';
import PrompterScriptContainer from '../../components/routes/prompter/prompter-script-container';
import Eyeline from '../../components/routes/prompter/eyeline';
import PrompterSettingsDialog from '../../components/routes/prompter/dialog-settings';

import { getScript, updateScript } from '../../components/script-manager';
import DefaultSettings from '../../components/routes/prompter/default-prompter-settings';

class Prompter extends Component {
  state = Object.assign({
    scrollPercent: 0,
  }, DefaultSettings);
  _progressBar;

  componentDidMount() {
    const scriptID = this.props.scriptID;
    this.loadScript(scriptID);
    document.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
  }

  getProgressBar() {
    if (this._progressBar) {
      return this._progressBar;
    }
    const pb = document.getElementById('headerProgress');
    if (pb) {
      this._progressBar = pb;
      return pb;
    }
    return null;
  }

  async loadScript(scriptID) {
    const script = await getScript(scriptID);
    if (!script) {
      route('/app', true);
      return;
    }
    document.title = script.title;
    this.setState(script);
    if (script.flipVertical) {
      setTimeout(() => {
        window.scrollTo({top: document.body.scrollHeight});
      }, 25);
    }
  }

  onScroll = () => {
    const pBar = this.getProgressBar();
    if (!pBar) {
      return;
    }
    const currentY = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    let percent = (currentY / (scrollHeight - windowHeight)) * 100;
    percent = Math.round(percent * 100) / 100;
    percent = Math.min(percent, 100);
    if (this.state.flipVertical) {
      percent = 100 - percent;
    }
    pBar.style = `width: ${percent}%;`;
  }

  onEyelineChange = (value) => {
    const obj = {eyelineHeight: value};
    this.setState(obj);
    updateScript(this.props.scriptID, obj);
  }

  onScrollSpeedChange = (value) => {
    const obj = {scrollSpeed: value};
    this.setState(obj);
    updateScript(this.props.scriptID, obj);
  }

  onSettingsChange = (key, value) => {
    const obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  onSettingsClose = async (settings) => {
    if (!settings) {
      return;
    }
    await updateScript(this.props.scriptID, settings);
  }

  render(props, state) {
    return (
      <div id="prompterContainer" class="container-fluid">
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
        <Eyeline
          margin={state.margin}
          value={state.eyelineHeight}
          flipHorizontal={state.flipHorizontal}
          onChange={this.onEyelineChange} />
        <PrompterScriptContainer
          asHTML={state.asHTML}
          fontSize={state.fontSize}
          margin={state.margin}
          lineHeight={state.lineHeight}
          allCaps={state.allCaps}
          flipHorizontal={state.flipHorizontal}
          flipVertical={state.flipVertical} />
        <PrompterFooter
          scrollSpeed={state.scrollSpeed}
          autoHideFooter={state.autoHideFooter}
          flipVertical={state.flipVertical}
          onScrollSpeedChange={this.onScrollSpeedChange} />
      </div>
    );
  }
}

export default Prompter;
