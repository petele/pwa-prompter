import { h, Component, createRef } from 'preact';

import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dist/dialog-polyfill.css';

import style from './style.css';

/* https://github.com/GoogleChrome/dialog-polyfill */


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

  render(props) {
    return (
      <dialog id="dialogConfirmDelete" class={style.confirmDeleteDialog} ref={this._dialogRef}>
        <header>
          <h2>Delete {props.title}</h2>
        </header>
        <form method="dialog">
          <div>
            confirm delete {props.scriptID}
          </div>
          <footer>
            <button onClick={this.closeDialog} type="button">
              YES
            </button>
            <button onClick={this.closeDialog} type="button">
              No
            </button>
          </footer>
        </form>
      </dialog>
    );
  }
}

export default ConfirmDeleteDialog;
