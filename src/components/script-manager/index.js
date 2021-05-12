import * as dataLayer from '../data-layer';
import { customAlphabet, urlAlphabet } from 'nanoid';

const DEFAULT_SCRIPT_TEMPLATE = {
  title: 'Untitled Script',
  asQuill: [],
  asHTML: '',
  snippet: '',
  hasStar: false,
  readOnly: false,
};

const _cachedScript = {
  key: null,
  data: null,
};

/**
 * Gets a script object from the data store
 *
 * @param {String} key
 * @returns Object
 */
export async function getScript(key) {
  if (key === _cachedScript.key) {
    return _cachedScript.data;
  }
  if (key === 'new') {
    const data = _createNewScript();
    _updateCachedScript(data);
    return data;
  }
  const data = await dataLayer.get(key);
  if (data) {
    _updateCachedScript(data);
    return data;
  }
  console.log(`[script_manager] script '${key}' not found.`);
  return;
}

/**
 * Updates the specified properties of the script object.
 *
 * @param {String} key Script identifier
 * @param {Object} data Properties of the script to update
 * @returns Promise
 */
export async function updateScript(key, data) {
  console.log('[script_manager] updateScript', key, data);
  const current = await getScript(key);
  if (!current || current.readOnly) {
    return;
  }
  Object.assign(current, data);
  await dataLayer.save(current);
  await _updateCachedScript(current);
  return current;
}

/**
 * Deletes the specified script.
 *
 * @param {String} key Script identifier
 * @param {Object} data Properties of the script to update
 * @returns Promise
 */
export async function deleteScript(key) {
  console.log('[script_manager] deleteScript', key);
  await dataLayer.del(key);
  if (key === _cachedScript.key) {
    _updateCachedScript(null);
  }
  return true;
}

/**
 * Gets the list of scripts available.
 *
 * @returns Object
 */
export async function getScriptList() {
  return dataLayer.list();
}

export async function syncWithFirebase() {
  return dataLayer.sync();
}

export async function removeLocalData() {
  return dataLayer.removeLocalData();
}


function _createNewScript() {
  const nanoid = customAlphabet(urlAlphabet, 21);
  const key = nanoid();
  const now = Date.now();
  const data = Object.assign({}, DEFAULT_SCRIPT_TEMPLATE);
  data.key = key;
  data.createdOn = now;
  data.lastUpdated = now;
  return data;
}


export async function setupSampleScript() {
  return dataLayer.createSampleScript();
}


function _updateCachedScript(data) {
  _cachedScript.key = data?.key;
  _cachedScript.data = data;
}
