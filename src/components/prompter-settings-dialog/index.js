import { h, Component } from 'preact';

import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dist/dialog-polyfill.css';

import './style.css';

/* https://github.com/GoogleChrome/dialog-polyfill */


class PrompterSettingsDialog extends Component {
  _settingsDialogRef = null;

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (!this.settingsDialogRef) {
      return;
    }
    dialogPolyfill.registerDialog(this._settingsDialogRef);
  }

  showModal = () => {
    this._settingsDialogRef.showModal();
  }

  // shouldComponentUpdate(nextProps) {
  //   console.log('dialog', nextProps);
  //   // if (nextProps?.scriptQuill) {
  //   //   this.initialUpdate = true;
  //   //   this.editor.setContents(nextProps.scriptQuill);
  //   // }
  //   // return false;
  // }

  render(props) {
    return (
      <dialog {...props} ref={el => { this._settingsDialogRef = el }}>
        <h2>Settings</h2>
        <form method="dialog">
          <div>scroll speed</div>
          <div>font size</div>
          <div>margin</div>
          <div>line height</div>
          <div>all caps</div>
          <div>
            <span>flip</span>
            <span>vertical</span>
            <span>horizontal</span>
          </div>
          <input type="submit" value="Close" />
        </form>
      </dialog>
    );
  }
}

export default PrompterSettingsDialog;
