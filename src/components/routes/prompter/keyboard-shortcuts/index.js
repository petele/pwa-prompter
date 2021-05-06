const KEYBOARD_SHORTCUTS = {
  Space: 'togglePlay',
  ArrowUp: 'skipBack',
  ArrowDown: 'skipForward',
  Escape: 'skipToHome',
  ArrowLeft: 'speedDown',
  ArrowRight: 'speedUp',
  KeyJ: 'markerPrev',
  KeyK: 'markerNext',
  KeyF: 'toggleFullscreen',
  Home: 'skipToHome',
  End: 'skipToEnd',
  PageUp: 'pageUp',
  PageDown: 'pageDown',
};

export const KEYS_TO_IGNORE = [
  'Alt', 'CapsLock', 'Control', 'Meta', 'Shift', 'Tab',
];

export function getShortcut(keyCombo) {
  if (keyCombo) {
    return KEYBOARD_SHORTCUTS[keyCombo];
  }
  return null;
}

export function getKeyCombination(e) {
  if (KEYS_TO_IGNORE.includes(e.key)) {
    return null;
  }
  const keys = [];
  if (e.altKey) {
    keys.push('Alt');
  }
  if (e.ctrlKey) {
    keys.push('Control');
  }
  if (e.metaKey) {
    keys.push('Meta');
  }
  if (e.shiftKey) {
    keys.push('Shift');
  }
  keys.push(e.code);
  return keys.join('+');
}
