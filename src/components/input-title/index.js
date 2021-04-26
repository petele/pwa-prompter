import { h, Component } from 'preact';

import style from './style.css';

class InputTitle extends Component {

  titleChanged = (e) => {
    if (this.props.onChange) {
      this.props.onChange({title: e.target.value});
    }
  }

  render(props) {
    return (
      <input class={style.title} name="script-title" onInput={this.titleChanged} value={props.title} />
    );
  }
}

export default InputTitle;
