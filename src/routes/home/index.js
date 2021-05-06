import { h, Component } from 'preact';
import style from './style.css';

import { getScriptList, updateScript, deleteScript } from '../../components/data-layer';

import DialogConfirmDelete from '../../components/routes/home/dialog-confirm-delete';
import ScriptListItem from '../../components/routes/home/script-list-item';

class Home extends Component {

  componentDidMount() {
    document.title = `MyPrompter`;
    this.refreshScriptList();
  }

  refreshScriptList = async () => {
    const scripts = await getScriptList();
    this.setState({scripts});
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

  map = (obj, callback) => {
    if (!obj || typeof obj !== 'object') {
      return [];
    }
    const result = [];
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const item = obj[key];
      result.push(callback(item, key));
    });
    return result;
  };

  render(props, state) {
    return (
      <div class={style.home}>
        <DialogConfirmDelete
          scriptDetails={state.scriptToDelete}
          onClose={this.onDeleteDialogClose}
          onDelete={this.onDeleteDialogConfirmed} />
        {this.map(state.scripts, (script, key) => (
          <ScriptListItem scriptID={key} onDelete={this.clickDelete} onStar={this.clickStar} {...script}  />
        ))}
        {/* <button onClick={this.refreshScriptList}>Refresh List</button> */}
      </div>);
  }

}

export default Home;
