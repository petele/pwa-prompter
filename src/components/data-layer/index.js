/* eslint-disable quote-props */

import { get, set, update, del, keys } from 'idb-keyval';

const SCRIPT_KEY_PREFIX = 'script';
const SCRIPT_LIST_KEY = 'scriptList';

const DEFAULT_SCRIPT_TEMPLATE = {
  asHTML: '',
  asQuill: [],
  snippet: '',
  createdOn: Date.now(),
  hasStar: false,
  lastUpdated: Date.now(),
  title: 'Untitled Script',
};

const _cachedScript = {
  id: null,
  script: null,
  list: null,
};

/**
 * Gets a script object from the data store
 *
 * @param {String} scriptID
 * @returns Object
 */
export async function getScript(scriptID) {
  if (_cachedScript.id === scriptID) {
    console.log('getScript', scriptID, '[cached]');
    return _cachedScript.script;
  }
  console.log('getScript', scriptID, '[db]');
  const idbKey = `${SCRIPT_KEY_PREFIX}.${scriptID}`;
  const scriptObj = await get(idbKey);
  if (scriptObj) {
    _cachedScript.id = scriptID;
    _cachedScript.script = scriptObj;
    return scriptObj;
  }
  console.log('getScript', scriptID, '[new]');
  return Object.assign({}, DEFAULT_SCRIPT_TEMPLATE);
}

/**
 * Updates the specified properties of the script object.
 *
 * @param {String} scriptID Script identifier
 * @param {Object} scriptObj Properties of the script to update
 * @returns Promise
 */
export async function updateScript(scriptID, scriptObj) {
  if (!scriptID || typeof scriptID !== 'string') {
    console.error('updateScript - invalid scriptID', scriptID);
    return;
  }
  if (typeof scriptObj !== 'object') {
    console.error('updateScript - invalid scriptObj', scriptObj);
    return;
  }
  console.log('updateScript', scriptID, scriptObj);
  const idbKey = `${SCRIPT_KEY_PREFIX}.${scriptID}`;
  return update(idbKey, (dbScriptObj) => {
    if (!dbScriptObj) {
      dbScriptObj = Object.assign({}, DEFAULT_SCRIPT_TEMPLATE);
    }
    Object.assign(dbScriptObj, scriptObj);
    _cachedScript.id = scriptID;
    _cachedScript.script = dbScriptObj;
    updateScriptListItem(scriptID, dbScriptObj);
    return dbScriptObj;
  });
}

/**
 * Deletes a script from the data store.
 *
 * @param {String} scriptID Script identifier
 */
export async function deleteScript(scriptID) {
  console.log('deleteScript', scriptID);
  const idbKey = `${SCRIPT_KEY_PREFIX}.${scriptID}`;
  await del(idbKey);
  if (_cachedScript.id === scriptID) {
    _cachedScript.id = null;
    _cachedScript.script = null;
  }
  delete _cachedScript.list[scriptID];
  set(SCRIPT_LIST_KEY, _cachedScript.list);
}

/**
 * Gets the list of scripts available.
 *
 * @returns Object
 */
export async function getScriptList() {
  console.log('getScriptList');
  if (_cachedScript.list) {
    return _cachedScript.list;
  }
  _cachedScript.list = await get(SCRIPT_LIST_KEY) || {};
  return _cachedScript.list;
}

export async function rebuildScriptList() {
  console.log('rebuildScriptList');
  const scriptKeys = await keys();
  for (let key of scriptKeys) {
    if (key.startsWith(SCRIPT_KEY_PREFIX)) {
      const scriptObj = await get(key);
      const scriptID = key.replace(`${SCRIPT_KEY_PREFIX}.`, '');
      updateScriptListItem(scriptID, scriptObj);
    }
  }
  await set(SCRIPT_LIST_KEY, _cachedScript.list);
  return _cachedScript.list;
}

function updateScriptListItem(scriptID, scriptObj) {
  const listItem = {
    scriptID,
    title: scriptObj.title,
    snippet: scriptObj.snippet,
    lastUpdated: scriptObj.lastUpdated,
    hasStar: scriptObj.hasStar || false,
  };
  _cachedScript.list[scriptID] = listItem;
  console.log('updateScriptListItem', scriptID, listItem);
  set(SCRIPT_LIST_KEY, _cachedScript.list);
}
