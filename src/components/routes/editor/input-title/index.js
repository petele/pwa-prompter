import { h } from 'preact';
import style from './style.css';

const InputTitle = ({title, readOnly = false, onChange}) => {

  const titleChanged = (e) => {
    if (onChange) {
      onChange({title: e.target.value});
    }
  }

  document.title = title ? `${title} - MyPrompter` : `MyPrompter`;

  return (
    <input
      tabindex="1"
      autocomplete="off"
      value={title}
      disabled={readOnly}
      readonly={readOnly}
      class={style.title}
      onInput={titleChanged} />
  );
}

export default InputTitle;
