import { h } from 'preact';

const PWAPSlider = ({id, label, suffix, value, min, max, onInput, onChange}) => {

  return (
    <div class="mb-3">
      <div class="d-flex">
        <label for={id} class="flex-grow-1">{label}</label>
        <span>{value}{suffix}</span>
      </div>
      <input id={id} type="range" min={min} max={max} class="w-100"
        onInput={onInput}
        onChange={onChange}
        value={value} />
    </div>
  );
}

export default PWAPSlider;
