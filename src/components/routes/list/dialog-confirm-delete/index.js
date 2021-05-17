import { h, Component, createRef } from 'preact';

/* https://github.com/GoogleChrome/dialog-polyfill */
import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dist/dialog-polyfill.css';

import style from './style.scss';

class ConfirmDeleteDialog extends Component {
  _dialogRef = createRef();

  componentDidMount() {
    if (this._dialogRef.current) {
      const dialog = this._dialogRef.current;
      dialogPolyfill.registerDialog(dialog);
      dialog.addEventListener('close', this.onClose);
    }
  }

  componentWillUnmount() {
    if (this._dialogRef.current) {
      const dialog = this._dialogRef.current;
      dialog.removeEventListener('close', this.onClose);
    }
  }

  onClose = (e) => {
    if (this.props?.onClose) {
      this.props.onClose(e);
    }
  }

  closeDialog = () => {
    if (this._dialogRef.current) {
      this._dialogRef.current.close();
    }
  }

  onClickCancel = () => {
    this.closeDialog();
  }

  onClickConfirm = () => {
    if (this.props?.onDelete) {
      const key = this.props.scriptDetails.key;
      this.props.onDelete(key);
    }
    this.closeDialog();
  }

  render(props) {
    return (
      <dialog id="dialogConfirmDelete" class={style.confirmDeleteDialog} ref={this._dialogRef}>
        <header>
          <h2>Delete Script</h2>
        </header>
        <form method="dialog">
          <div>
            Are you sure you want to delete&nbsp;
            <b>{props?.scriptDetails?.title}</b>
          </div>
          <footer>
            <button onClick={this.onClickConfirm} type="button">
              YES
            </button>
            <button onClick={this.onClickCancel} type="button">
              No
            </button>
          </footer>
        </form>
      </dialog>
    );
  }
}

export default ConfirmDeleteDialog;
