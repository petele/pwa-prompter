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
 * Gets a script object from the data store.
 *
 * @param {string} key Script identifier.
 * @param {boolean} forceNetwork Get the script from the network.
 * @returns {Promise<!dataLayer.Script>}
 */
export async function getScript(key, forceNetwork) {
  if (forceNetwork) {
    const data = await dataLayer.getFromFirebase(key);
    if (data) {
      _updateCachedScript(data);
      return data;
    }
    return;
  }
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
 * @param {string} key Script identifier.
 * @param {object} data Properties of the script to update.
 * @returns {Promise<!dataLayer.Script>} Updated script object.
 */
export async function updateScript(key, data) {
  console.log('[script_manager] updateScript', key, data);
  const current = await getScript(key);
  if (!current || current.readOnly) {
    return;
  }
  Object.assign(current, data);
  await dataLayer.save(current);
  _updateCachedScript(current);
  return current;
}

/**
 * Deletes the specified script.
 *
 * @param {string} key Script identifier.
 * @returns {Promise<boolean>} Script was successfully deleted.
 */
export async function deleteScript(key) {
  console.log('[script_manager] deleteScript', key);
  const result = await dataLayer.del(key);
  if (key === _cachedScript.key) {
    _updateCachedScript(null);
  }
  return result;
}

/**
 * Gets the list of scripts available.
 *
 * @returns {Promise<Array>} List of scripts
 */
export async function getScriptList() {
  return dataLayer.list();
}

/**
 * Syncs the local and remote datastore.
 *
 * @returns {Promise<boolean>} True on successful sync.
 */
export async function syncWithFirebase() {
  return dataLayer.sync();
}

/**
 * Removes all data from the local datastore.
 *
 * @returns {Promise<undefined>}
 */
export async function removeLocalData() {
  return dataLayer.removeLocalData();
}

/**
 * Creates a new script with the default script options.
 *
 * @returns {dataLayer.Script}
 */
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


/**
 * Creates a new script with sample data.
 *
 * @returns {Promise<dataLayer.Script>}
 */
export async function setupSampleScript() {
  return dataLayer.createSampleScript();
}

/**
 * Updates the cached script with the provided script.
 *
 * @param {!dataLayer.Script} data Script object to cache.
 * @returns {undefined}
 */
function _updateCachedScript(data) {
  _cachedScript.key = data?.key;
  _cachedScript.data = data;
}
