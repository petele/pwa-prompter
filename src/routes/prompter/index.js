import { h, Component, createRef } from 'preact';
import { route } from 'preact-router';
import style from './style.css';

import PrompterFooter from '../../components/prompter-footer';
import ProgressBar from '../../components/progress-bar';
import PrompterScriptContainer from '../../components/prompter-script-container';
import Eyeline from '../../components/eyeline';
import PrompterSettingsDialog from '../../components/prompter-settings-dialog';

import { getScript, updateScript } from '../../components/data-layer';
import DefaultSettings from '../../components/default-prompter-settings';

class Prompter extends Component {
  _ref = createRef();
  _loading = false;
  updatedSettings = {};
  state = Object.assign({class: style.prompter}, DefaultSettings);

  componentDidMount() {
    const scriptID = this.props.scriptID;
    if (scriptID.length != 21) {
      route(`/`, true);
      return;
    }
    this.loadScript(scriptID);
  }

  async loadScript(scriptID) {
    if (this._loading) {
      console.log('already attempting to load...');
      return;
    }
    this._loading = true;
    const newState = await getScript(scriptID);
    newState.scriptID = scriptID;
    this.setState(newState);
    const title = newState.title;
    document.title = title ? `${title} - MyPrompter` : `MyPrompter`;
    this._loading = false;
  }

  onFooterVisibleChange = (isVisible) => {
    this._ref.current.classList.toggle(style.footerHidden, !isVisible);
  }

  onScrollChange = async (value) => {
    this.setState({scrollPercent: value});
  }

  onEyelineChange = async (value) => {
    const obj = {eyelineHeight: value};
    this.setState(obj);
    await updateScript(this.props.scriptID, obj);
  }

  onScrollSpeedChange = async (value) => {
    const obj = {scrollSpeed: value};
    this.setState(obj);
    await updateScript(this.props.scriptID, obj);
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
      <div id="docScroller" class={style.prompter} ref={this._ref}>
        <ProgressBar percent={state.scrollPercent} />
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
          onScrollChange={this.onScrollChange}
          onScrollSpeedChange={this.onScrollSpeedChange}
          onFooterVisibleChange={this.onFooterVisibleChange} />
      </div>
    );
  }
}

export default Prompter;
