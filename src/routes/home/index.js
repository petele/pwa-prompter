import { h, Component } from 'preact';
import style from './style.css';
import { route } from 'preact-router';


import { map } from 'lodash';
import { customAlphabet, urlAlphabet } from 'nanoid';

import { getScriptList, updateScriptList, updateScript } from '../../components/data-layer';
import ScriptListItem from '../../components/script-list-item';

class Home extends Component {

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    getScriptList().then((scripts) => {
      console.log('list', scripts);
      this.setState({scripts});
    });
  }

  clickNew = function() {
    const nanoid = customAlphabet(urlAlphabet, 21);
    const newPath = `/editor/${ nanoid() }`;
    route(newPath);
  }

  clickRefresh = async () => {
    const scripts = await updateScriptList();
    this.setState({scripts});
  }

  clickDelete = async (scriptID) => {
    console.log('TODO: add dialog and delete item', scriptID);
    // await deleteScript(scriptID);
    // const scripts = await updateScriptList();
    // this.setState({scripts});
  }

  clickStar = async (scriptID, hasStar) => {
    console.log('clicked star', scriptID, hasStar);
    updateScript(scriptID, {hasStar});
    const scripts = await updateScriptList();
    this.setState({scripts});
  }


  render(props, state) {
    const scripts = state.scripts;
    return (
      <div class={style.home}>
        <h1>Scripts</h1>
        {map(scripts, (script, key) => (
          <ScriptListItem scriptID={key} onDelete={this.clickDelete} onStar={this.clickStar} {...script}  />
        ))}
        <button onClick={this.clickNew}>New Script</button>
        <button onClick={this.clickRefresh}>Refresh List</button>
      </div>);
  }

}

export default Home;
