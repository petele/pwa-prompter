import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';

import PrompterFooter from '../../components/routes/prompter/prompter-footer';
import ProgressBar from '../../components/routes/prompter/progress-bar';
import PrompterScriptContainer from '../../components/routes/prompter/prompter-script-container';
import Eyeline from '../../components/routes/prompter/eyeline';
import PrompterSettingsDialog from '../../components/routes/prompter/dialog-settings';

import { getScript, updateScript } from '../../components/script-manager';
import DefaultSettings from '../../components/routes/prompter/default-prompter-settings';

class Prompter extends Component {
  updatedSettings = {};
  state = Object.assign({
    class: style.prompter,
    scrollPercent: 0,
  }, DefaultSettings);

  componentDidMount() {
    const scriptID = this.props.scriptID;
    this.loadScript(scriptID);
    document.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
  }

  async loadScript(scriptID) {
    const script = await getScript(scriptID);
    if (!script) {
      route('/', true);
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
    const currentY = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    let percent = (currentY / (scrollHeight - windowHeight)) * 100;
    percent = Math.round(percent * 100) / 100;
    percent = Math.min(percent, 100);
    this.setState({scrollPercent: percent});
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
    this.updatedSettings[key] = value;
    this.setState(this.updatedSettings);
  }

  onSettingsClose = async () => {
    if (Object.keys(this.updatedSettings).length > 0) {
      await updateScript(this.props.scriptID, this.updatedSettings);
      this.updatedSettings = {};
    }
  }

  render(props, state) {
    return (
      <div id="prompterContainer" class={style.prompter}>
        <ProgressBar
          percent={state.scrollPercent}
          flipVertical={state.flipVertical} />
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
