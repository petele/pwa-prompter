import { h, Component } from 'preact';

class ConfirmDeleteDialog extends Component {

  onClickConfirm = () => {
    if (this.props?.onDelete) {
      const key = this.props.scriptDetails.key;
      this.props.onDelete(key);
    }
  }

  render(props) {
    return (
      <div class="modal" id="dialogConfirmDelete" data-bs-backdrop="static" tabindex="-1">
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
