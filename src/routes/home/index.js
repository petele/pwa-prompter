import { h, Component } from 'preact';
import style from './style.css';
import { route } from 'preact-router';

import map from 'lodash/map';
import { customAlphabet, urlAlphabet } from 'nanoid';

import DialogConfirmDelete from '../../components/routes/home/dialog-confirm-delete';

import { getScriptList, updateScript, deleteScript } from '../../components/data-layer';
import ScriptListItem from '../../components/script-list-item';

class Home extends Component {

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    this.refreshScriptList();
  }

  refreshScriptList = async () => {
    const scripts = await getScriptList();
    this.setState({scripts});
  }

  clickNew = function() {
    const nanoid = customAlphabet(urlAlphabet, 21);
    const newPath = `/editor/${ nanoid() }`;
    route(newPath);
  }

  clickDelete = (scriptID) => {
    const scriptToDelete = this.state.scripts[scriptID];
    this.setState({scriptToDelete});
    const dialogDelete = document.querySelector('#dialogConfirmDelete');
    dialogDelete.showModal();
  }

  clickStar = async (scriptID, hasStar) => {
    await updateScript(scriptID, {hasStar});
    this.refreshScriptList();
  }

  onDeleteDialogConfirmed = async (scriptID) => {
    await deleteScript(scriptID);
    this.refreshScriptList();
  }

  onDeleteDialogClose = () => {
    this.setState({scriptToDelete: null});
  }

  render(props, state) {
    return (
      <div class={style.home}>
        <DialogConfirmDelete
          scriptDetails={state.scriptToDelete}
          onClose={this.onDeleteDialogClose}
          onDelete={this.onDeleteDialogConfirmed} />
        <h1>Scripts</h1>
        {map(state.scripts, (script, key) => (
          <ScriptListItem scriptID={key} onDelete={this.clickDelete} onStar={this.clickStar} {...script}  />
        ))}
        <button onClick={this.clickNew}>New Script</button>
        <button onClick={this.refreshScriptList}>Refresh List</button>
      </div>);
  }

}

export default Home;
