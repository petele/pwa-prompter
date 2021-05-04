import { h } from 'preact';
import style from './style.css';

const Eyeline = ({margin = 15, value = 40, flipHorizontal, onChange}) => {

  const eyelineChange = (e) => {
    if (onChange) {
      onChange(parseInt(e.target.value, 10));
    }
  }
  const mValue = flipHorizontal ? `${100 - parseInt(margin, 10)}` : margin;
  const flipHClass = flipHorizontal ? style.flipH : '';

  return (
    <input type="range" min="0" max="100"
      value={value}
      class={`${style.eyeline} ${flipHClass}`}
      style={`margin-left: ${mValue}%;`}
      onChange={eyelineChange} />
  );
}

export default Eyeline;
