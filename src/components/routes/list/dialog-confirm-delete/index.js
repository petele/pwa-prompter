import { h, Component } from 'preact';

import Modal from 'bootstrap/js/dist/modal';

class ConfirmDeleteDialog extends Component {
  _elem = null;
  _modal = null;

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

  onShow = () => {}
  onHidden = () => {}

  onClickConfirm = () => {
    if (this.props?.onDelete) {
      const key = this.props.scriptDetails.key;
      this.props.onDelete(key);
    }
    this._modal.hide();
  }

  render(props) {
    return (
      <div class="modal" id="dialogConfirmDelete" tabindex="-1" ref={el => { this._elem = el }}>
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Delete script?</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
              <p>
                Are you sure you want to delete&nbsp;
                <b>{props?.scriptDetails?.title}</b>
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" onClick={this.onClickConfirm} class="btn btn-primary">Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmDeleteDialog;
