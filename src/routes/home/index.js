import { h, Component } from 'preact';
import style from './style.css';

import ScriptListItem from '../../components/routes/home/script-list-item';
import DialogConfirmDelete from '../../components/routes/home/dialog-confirm-delete';
import { getScriptList, updateScript, deleteScript, syncWithFirebase } from '../../components/script-manager';

class Home extends Component {
  state = {
    scripts: [],
  };

  componentDidMount() {
    document.title = `MyPrompter`;
    this.refreshScriptList();
    syncWithFirebase().then(() => {
      this.refreshScriptList();
    });
  }

  refreshScriptList = async () => {
    const scripts = await getScriptList();
    this.setState({scripts});
  }

  clickStar = async (scriptID, hasStar) => {
    await updateScript(scriptID, {hasStar});
    this.refreshScriptList();
  }

  clickDelete = (scriptID, idx) => {
    const scriptToDelete = this.state.scripts[idx];
    if (scriptToDelete?.key !== scriptID) {
      console.log('delete - mismatched keys');
      return;
    }
    this.setState({scriptToDelete});
    const dialogDelete = document.querySelector('#dialogConfirmDelete');
    dialogDelete.showModal();
  }

  onDeleteDialogConfirmed = async (scriptID) => {
    await deleteScript(scriptID);
    this.refreshScriptList();
  }

  onDeleteDialogClose = () => {
    this.setState({scriptToDelete: null});
  }

  peteTest = async () => {
    await syncWithFirebase();
    this.refreshScriptList();
  }

  render(props, state) {
    return (
      <div class={style.home}>
        <DialogConfirmDelete
          scriptDetails={state.scriptToDelete}
          onClose={this.onDeleteDialogClose}
          onDelete={this.onDeleteDialogConfirmed} />
        {state.scripts.map((script, idx) =>
          <ScriptListItem key={idx} scriptID={script.key} idx={idx} onDelete={this.clickDelete} onStar={this.clickStar} {...script}  />
        )}
        <button onClick={this.peteTest}>Sync</button>
      </div>);
  }

}

export default Home;
