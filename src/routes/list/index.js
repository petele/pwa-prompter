import { h, Component } from 'preact';

import ScriptListItem from '../../components/routes/list/script-list-item';
import DialogConfirmDelete from '../../components/routes/list/dialog-confirm-delete';
import { getScriptList, updateScript, deleteScript, syncWithFirebase } from '../../components/script-manager';

import Modal from 'bootstrap/js/dist/modal';

class List extends Component {
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
    const elem = document.getElementById('dialogConfirmDelete');
    const modal = Modal.getInstance(elem);
    modal.show();
  }

  onDeleteDialogConfirmed = async (scriptID) => {
    await deleteScript(scriptID);
    this.refreshScriptList();
  }

  clickSync = async () => {
    await syncWithFirebase();
    this.refreshScriptList();
  }

  render(props, state) {
    return (
      <div class="container-fluid">
        <DialogConfirmDelete
          scriptDetails={state.scriptToDelete}
          onClose={this.onDeleteDialogClose}
          onDelete={this.onDeleteDialogConfirmed} />
        {state.scripts.map((script, idx) =>
          <ScriptListItem key={idx} scriptID={script.key} idx={idx} onDelete={this.clickDelete} onStar={this.clickStar} {...script}  />
        )}
        {props.uid && <button type="button" class="btn btn-primary" onClick={this.clickSync}>Sync</button>}
      </div>);
  }

}

export default List;
