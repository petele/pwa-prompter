import { h } from 'preact';
import style from './style.css';

const InputTitle = ({title, onChange}) => {

  const titleChanged = (e) => {
    if (onChange) {
      onChange({title: e.target.value});
    }
  }

  return (
    <input class={style.title} name="script-title" onInput={titleChanged} value={title} />
  );
}

export default InputTitle;
