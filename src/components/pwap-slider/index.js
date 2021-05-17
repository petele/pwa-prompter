import { h } from 'preact';
import style from './style.scss';

const PWAPSlider = ({id, label, suffix, value, min, max, onInput, onChange}) => {

  return (
    <div class={style.pwapSlider}>
      <div class={style.flex}>
        <label for={id} class={style.label}>{label}</label>
        <span class={style.value}>{value}{suffix}</span>
      </div>
      <input id={id} type="range" min={min} max={max}
        onInput={onInput}
        onChange={onChange}
        value={value} />
    </div>
  );
}

export default PWAPSlider;
