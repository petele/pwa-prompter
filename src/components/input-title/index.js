import { h, Component } from 'preact';

import style from './style.css';

import { updateScript } from '../data-layer';

class InputTitle extends Component {

  titleChanged = (e) => {
    const title = e.target.value;
    updateScript(this.props.scriptID, {title});
  }

  render(props) {
    return (
      <input class={style.inputTitle} name="script-title" onInput={this.titleChanged} value={props.title} />
    );
  }
}

export default InputTitle;
