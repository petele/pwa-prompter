import { h } from 'preact';
import style from './style.css';

const Eyeline = ({margin = 15, value = 40, flipHorizontal, onChange}) => {

  const eyelineChange = (e) => {
    if (onChange) {
      let newVal = parseInt(e.target.value, 10);
      if (flipHorizontal) {
        newVal = 100 - newVal;
      }
      onChange(newVal);
    }
  }

  const classList = [style.eyeline];
  if (flipHorizontal) {
    margin = 100 - margin;
    value = 100 - value;
    classList.push(style.flipH);
  }

  return (
    <input type="range" min="0" max="100"
      value={value}
      class={classList.join(' ')}
      style={`margin-left: ${margin}%;`}
      onChange={eyelineChange} />
  );
}

export default Eyeline;
