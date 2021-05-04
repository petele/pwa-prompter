import { h, Component } from 'preact';
import { route } from 'preact-router';

import style from './style.css';

import MyQuill from '../../components/routes/editor/my-quill';
import InputTitle from '../../components/routes/editor/input-title';
import LastUpdated from '../../components/routes/editor/last-updated';

import { getScript, updateScript } from '../../components/data-layer';

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
    script.scriptID = scriptID;
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
        <InputTitle title={state.title} onChange={this.onTitleChange} />
        <MyQuill asQuill={state.asQuill} onChange={this.onQuillChange} />
        <LastUpdated lastUpdated={state.lastUpdated} />
      </div>
    );
  }
}

export default Editor;
