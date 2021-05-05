import { h } from 'preact';
import style from './style.css';

const ProgressBar = ({percent = 0}) => {

  const width = `width: ${percent}%;`

  return (
    <div class={style.progress} style={width} />
  );
}

export default ProgressBar;
