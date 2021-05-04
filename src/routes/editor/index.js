import { h, Component } from 'preact';
import { route } from 'preact-router';

import style from './style.css';

import MyQuill from '../../components/my-quill';
import InputTitle from '../../components/input-title';
import LastUpdated from '../../components/last-updated';

import { getScript, updateScript } from '../../components/data-layer';

class Editor extends Component {

  componentDidMount() {
    const scriptID = this.props.scriptID;
    if (this.props.scriptID.length != 21) {
      route(`/`, true);
      return;
    }
    this.loadScript(scriptID);
  }

  async loadScript(scriptID) {
    const newState = await getScript(scriptID);
    newState.scriptID = scriptID;
    this.setState(newState);
    const title = newState.title;
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
        <InputTitle title={state.title} onChange={this.onTitleChange} />
        <MyQuill asQuill={state.asQuill} onChange={this.onQuillChange} />
        <LastUpdated lastUpdated={state.lastUpdated} />
      </div>
    );
  }
}

export default Editor;
