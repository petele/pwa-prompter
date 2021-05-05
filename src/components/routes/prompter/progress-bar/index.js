import { h } from 'preact';
import style from './style.css';

const ProgressBar = ({percent = 0, flipVertical}) => {

  if (flipVertical) {
    percent = 100 - percent;
  }

  return (
    <div class={style.progress} style={`width: ${percent}%`} />
  );
}

export default ProgressBar;
