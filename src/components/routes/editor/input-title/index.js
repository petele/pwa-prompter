import { h } from 'preact';
import style from './style.scss';

const InputTitle = ({title, readOnly = false, onChange}) => {

  const titleChanged = (e) => {
    if (onChange) {
      onChange({title: e.target.value});
    }
  }

  document.title = title ? `${title} - MyPrompter` : `MyPrompter`;

  const classList = `${style.title} form-control form-control-lg`;

  return (
    <input
      tabindex="1"
      autocomplete="off"
      value={title}
      disabled={readOnly}
      readonly={readOnly}
      class={classList}
      aria-label="Script title"
      onInput={titleChanged} />
  );
}

export default InputTitle;
