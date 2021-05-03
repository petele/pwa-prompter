import { h } from 'preact';
import style from './style.css';

const Eyeline = ({margin = 15, value = 40, onChange}) => {

  const eyelineChange = (e) => {
    if (onChange) {
      onChange({eyelineHeight: e.target.value});
    }
  }

  return (
    <input type="range" min="0" max="100"
      value={value}
      class={style.eyeline}
      style={`margin-left: ${margin}%;`}
      onChange={eyelineChange} />
  );
}

export default Eyeline;
