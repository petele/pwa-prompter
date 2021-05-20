import { h, Component } from 'preact';

import Modal from 'bootstrap/js/dist/modal';

import PWAPSlider from '../../../pwap-slider';
import DefaultSettings from '../default-prompter-settings';

class PrompterSettingsDialog extends Component {
  _elem = null;
  _modal = null;
  _propsChanged = {};

  componentDidMount() {
    this._modal = new Modal(this._elem, {});
    this._elem.addEventListener('hidden.bs.modal', this.onHidden);
    this._elem.addEventListener('show.bs.modal', this.onShow);
  }

  componentWillUnmount() {
    this._elem.removeEventListener('hidden.bs.modal', this.onHidden);
    this._elem.removeEventListener('show.bs.modal', this.onShow);
    this._modal.dispose();
  }

  onShow = () => {
    this._propsChanged = {};
  }

  onHidden = () => {
    if (this.props?.onClose) {
      const anythingChanged = Object.keys(this._propsChanged).length > 0;
      const result = anythingChanged ? this._propsChanged : null;
      this.props.onClose(result);
    }
  }

  onInputSpeed = (e) => {
    const value = parseInt(e.target.value, 10);
    this._propsChanged.scrollSpeed = value;
    if (this.props?.onChange) {
      this.props.onChange('scrollSpeed', value);
    }
  }

  onInputFontSize = (e) => {
    const value = parseFloat(e.target.value);
    this._propsChanged.fontSize = value;
    if (this.props?.onChange) {
      this.props.onChange('fontSize', value);
    }
  }

  onInputMargin = (e) => {
    const value = parseInt(e.target.value, 10);
    this._propsChanged.margin = value;
    if (this.props?.onChange) {
      this.props.onChange('margin', value);
    }
  }

  onInputLineHeight = (e) => {
    const value = parseInt(e.target.value, 10);
    this._propsChanged.lineHeight = value;
    if (this.props?.onChange) {
      this.props.onChange('lineHeight', value);
    }
  }

  onChangeAllCaps = (e) => {
    const value = e.target.checked;
    this._propsChanged.allCaps = value;
    if (this.props?.onChange) {
      this.props.onChange('allCaps', value);
    }
  }

  onChangeHideFooter = (e) => {
    const value = e.target.checked;
    this._propsChanged.autoHideFooter = value;
    if (this.props?.onChange) {
      this.props.onChange('autoHideFooter', value);
    }
  }

  onChangeFlipH = (e) => {
    const value = e.target.checked;
    this._propsChanged.flipHorizontal = value;
    if (this.props?.onChange) {
      this.props.onChange('flipHorizontal', value);
    }
  }

  onChangeFlipV = (e) => {
    const value = e.target.checked;
    this._propsChanged.flipVertical = value;
    if (this.props?.onChange) {
      this.props.onChange('flipVertical', value);
    }
  }

  render(props) {
    return (
      <div class="modal" id="dialogSettings" tabindex="-1" ref={el => { this._elem = el }}>
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Settings</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
              <PWAPSlider id="optScrollSpeed" label="Scroll Speed" value={props.scrollSpeed} min="1" max="400" onInput={this.onInputSpeed} />
              <PWAPSlider id="optFontSize" label="Font Size" value={props.fontSize} min="1" max="16" onInput={this.onInputFontSize} />
              <PWAPSlider id="optMargin" label="Margin" suffix="%" value={props.margin} min="0" max="40" onInput={this.onInputMargin} />
              <PWAPSlider id="optLineHeight" label="Line Height" suffix="%" value={props.lineHeight} min="80" max="200" onInput={this.onInputLineHeight} />
              <div class="form-check">
                <input class="form-check-input" type="checkbox" onInput={this.onChangeAllCaps} checked={props.allCaps} id="allCaps" />
                <label class="form-check-label" for="allCaps">
                  All Caps
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" onInput={this.onChangeHideFooter} checked={props.autoHideFooter} id="autoHideFooter" />
                <label class="form-check-label" for="autoHideFooter">
                  Hide footer on scroll
                </label>
              </div>
              <label class="form-check-label d-block">
                Flip
              </label>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="inlineCheckbox1" onInput={this.onChangeFlipH} checked={props.flipHorizontal} />
                <label class="form-check-label" for="inlineCheckbox1">Horizontal</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="inlineCheckbox2" onInput={this.onChangeFlipV} checked={props.flipVertical} />
                <label class="form-check-label" for="inlineCheckbox2">Vertical</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" data-bs-dismiss="modal" class="btn btn-primary">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PrompterSettingsDialog.defaultProps = DefaultSettings;

export default PrompterSettingsDialog;
