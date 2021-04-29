import { h, Component } from 'preact';
import style from './style.css';

class Eyeline extends Component {

  eyelineChange = (e) => {
    if (this.props?.onChange) {
      this.props.onChange(e.target.value);
    }
  }

  render(props) {
    return (
      <input class={style.eyeline} onChange={this.eyelineChange} type="range" min="0" max="100" value={props.value} />
    );
  }
}

Eyeline.defaultProps = {
  value: 40,
};

export default Eyeline;
