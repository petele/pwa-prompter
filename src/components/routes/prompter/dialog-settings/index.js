import { h, Component, createRef } from 'preact';

/* https://github.com/GoogleChrome/dialog-polyfill */
import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dist/dialog-polyfill.css';

import PWAPSlider from '../../../pwap-slider';

import style from './style.scss';

import DefaultSettings from '../default-prompter-settings';

class PrompterSettingsDialog extends Component {
  _settingsDialogRef = createRef();

  componentDidMount() {
    if (this._settingsDialogRef.current) {
      const dialog = this._settingsDialogRef.current;
      dialogPolyfill.registerDialog(dialog);
      dialog.addEventListener('close', this.onClose);
    }
  }

  componentWillUnmount() {
    if (this._settingsDialogRef.current) {
      const dialog = this._settingsDialogRef.current;
      dialog.removeEventListener('close', this.onClose);
    }
  }

  onClose = (e) => {
    if (this.props?.onClose) {
      this.props.onClose(e);
    }
  }

  closeDialog = () => {
    if (this._settingsDialogRef.current) {
      this._settingsDialogRef.current.close();
    }
  }

  onInputSpeed = (e) => {
    const value = parseInt(e.target.value, 10);
    if (this.props?.onChange) {
      this.props.onChange('scrollSpeed', value);
    }
  }

  onInputFontSize = (e) => {
    const value = parseFloat(e.target.value);
    if (this.props?.onChange) {
      this.props.onChange('fontSize', value);
    }
  }

  onInputMargin = (e) => {
    const value = parseInt(e.target.value, 10);
    if (this.props?.onChange) {
      this.props.onChange('margin', value);
    }
  }

  onInputLineHeight = (e) => {
    const value = parseInt(e.target.value, 10);
    if (this.props?.onChange) {
      this.props.onChange('lineHeight', value);
    }
  }

  onChangeAllCaps = (e) => {
    const value = e.target.checked;
    if (this.props?.onChange) {
      this.props.onChange('allCaps', value);
    }
  }

  onChangeHideFooter = (e) => {
    const value = e.target.checked;
    if (this.props?.onChange) {
      this.props.onChange('autoHideFooter', value);
    }
  }

  onChangeFlipH = (e) => {
    const value = e.target.checked;
    if (this.props?.onChange) {
      this.props.onChange('flipHorizontal', value);
    }
  }

  onChangeFlipV = (e) => {
    const value = e.target.checked;
    if (this.props?.onChange) {
      this.props.onChange('flipVertical', value);
    }
  }

  render(props) {
    return (
      <dialog id="dialogSettings" class={style.settingsDialog} ref={this._settingsDialogRef}>
        <header>
          <h2>Settings</h2>
        </header>
        <form method="dialog">
          <PWAPSlider id="optScrollSpeed" label="Scroll Speed" value={props.scrollSpeed} min="1" max="400" onInput={this.onInputSpeed} />
          <PWAPSlider id="optFontSize" label="Font Size" value={props.fontSize} min="1" max="16" onInput={this.onInputFontSize} />
          <PWAPSlider id="optMargin" label="Margin" suffix="%" value={props.margin} min="0" max="40" onInput={this.onInputMargin} />
          <PWAPSlider id="optLineHeight" label="Line Height" suffix="%" value={props.lineHeight} min="80" max="200" onInput={this.onInputLineHeight} />
          <div class={style.flex}>
            <input id="allCaps" type="checkbox" onInput={this.onChangeAllCaps} checked={props.allCaps} />
            <label for="allCaps">
              All Caps
            </label>
          </div>
          <div class={style.flex}>
            <input id="autoHideFooter" type="checkbox" onInput={this.onChangeHideFooter} checked={props.autoHideFooter} />
            <label for="autoHideFooter">Hide Footer on Scroll</label>
          </div>
          <div>
            <div class={style.label}>Flip</div>
            <div class={style.flip}>
              <div class={style.flex}>
                <input id="flipH" type="checkbox" onInput={this.onChangeFlipH} checked={props.flipHorizontal} />
                <label for="flipH">Horizontal</label>
              </div>
              <div class={style.flex}>
                <input id="flipV" type="checkbox" onInput={this.onChangeFlipV} checked={props.flipVertical} />
                <label for="flipV">Vertical</label>
              </div>
            </div>
          </div>
          <footer>
            <button onClick={this.closeDialog} type="button">
              Close
            </button>
          </footer>
        </form>
      </dialog>
    );
  }
}

PrompterSettingsDialog.defaultProps = DefaultSettings;

export default PrompterSettingsDialog;
