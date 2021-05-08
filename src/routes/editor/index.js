import { h, Component } from 'preact';
import { route } from 'preact-router';

import style from './style.css';

import MyQuill from '../../components/routes/editor/my-quill';
import InputTitle from '../../components/routes/editor/input-title';
import LastUpdated from '../../components/routes/editor/last-updated';

import { getScript, updateScript } from '../../components/script-manager';

class Editor extends Component {

  componentDidMount() {
    const scriptID = this.props.scriptID;
    this.loadScript(scriptID);
  }

  async loadScript(scriptID) {
    const script = await getScript(scriptID);
    if (!script) {
      route('/', true);
      return;
    }
    if (scriptID === 'new') {
      route(`/editor/${script.key}`, true);
    }
    this.setState(script);
    const title = script.title;
    document.title = title ? `${title} - MyPrompter` : `MyPrompter`;
  }

  onQuillChange = (newVal) => {
    const lastUpdated = Date.now();
    newVal.lastUpdated = lastUpdated;
    updateScript(this.props.scriptID, newVal);
    this.setState({lastUpdated});
  }

  onTitleChange = (newVal) => {
    const lastUpdated = Date.now();
    newVal.lastUpdated = lastUpdated;
    updateScript(this.props.scriptID, newVal);
    this.setState(newVal);
  }

  render(props, state) {
    return (
      <div class={style.editor}>
        <InputTitle title={state.title} readOnly={state.readOnly} onChange={this.onTitleChange} />
        <MyQuill asQuill={state.asQuill} readOnly={state.readOnly} onChange={this.onQuillChange} />
        <LastUpdated lastUpdated={state.lastUpdated} readOnly={state.readOnly} />
      </div>
    );
  }
}

export default Editor;
