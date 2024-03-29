import { h, Component } from 'preact';
import { route } from 'preact-router';

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
      route('/app', true);
      return;
    }
    if (scriptID === 'new') {
      route(`/editor/${script.key}`, true);
    }
    this.setState(script);
    const title = script.title;
    document.title = title ? `${title} - MyPrompter` : `MyPrompter`;
  }

  onResync = async () => {
    const scriptID = this.props.scriptID;
    const script = await getScript(scriptID, true);
    if (!script || !this.state.lastUpdated) {
      return;
    }
    const hasChanged = !(this.state.lastUpdated === script.lastUpdated);
    console.log('TODO: editor/onResync', hasChanged);
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
      <div class="container-fluid">
        <InputTitle title={state.title} readOnly={state.readOnly} onChange={this.onTitleChange} />
        <MyQuill asQuill={state.asQuill} lastUpdated={state.lastUpdated} readOnly={state.readOnly} onChange={this.onQuillChange} onResync={this.onResync} />
        <LastUpdated lastUpdated={state.lastUpdated} readOnly={state.readOnly} />
      </div>
    );
  }
}

export default Editor;
