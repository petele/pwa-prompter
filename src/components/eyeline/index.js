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
      <input type="range" min="0" max="100"
        value={props.value}
        class={style.eyeline}
        style={`margin-left: ${props.margin}%;`}
        onChange={this.eyelineChange} />
    );
  }
}

Eyeline.defaultProps = {
  margin: 15,
  value: 40,
};

export default Eyeline;
