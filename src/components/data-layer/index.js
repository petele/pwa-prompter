/* eslint-disable quote-props */

import { customAlphabet, urlAlphabet } from 'nanoid';
import { get, set, update, del, keys } from 'idb-keyval';

import { sampleScriptList, sampleScript } from '../sample-script';

import { saveScriptToFB, saveScriptListToFB } from '../firebase';

const SCRIPT_KEY_PREFIX = 'script';
const SCRIPT_LIST_KEY = 'scriptList';

const DEFAULT_SCRIPT_TEMPLATE = {
  title: 'Untitled Script',
  asQuill: [],
  asHTML: '',
  snippet: '',
  hasStar: false,
  readOnly: false,
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
  if (scriptID === 'sample') {
    return sampleScript;
  }
  if (_cachedScript.id === scriptID) {
    console.log('getScript', scriptID, '[cached]');
    return _cachedScript.script;
  }
  await getScriptList();
  console.log('getScript', scriptID, '[db]');
  const idbKey = `${SCRIPT_KEY_PREFIX}.${scriptID}`;
  const scriptObj = await get(idbKey);
  if (scriptObj) {
    _cachedScript.id = scriptID;
    _cachedScript.script = scriptObj;
    return scriptObj;
  }
  console.warn('getScript', scriptID, '[not_found]');
  return null;
}

export async function createNewScript() {
  const nanoid = customAlphabet(urlAlphabet, 21);
  const scriptID = nanoid();
  const scriptObj = Object.assign({}, DEFAULT_SCRIPT_TEMPLATE);
  const now = Date.now();
  scriptObj.scriptID = scriptID;
  scriptObj.createdOn = now;
  scriptObj.lastUpdated = now;
  const idbKey = `${SCRIPT_KEY_PREFIX}.${scriptID}`;
  console.log('createScript', scriptID);
  await set(idbKey, scriptObj);
  _cachedScript.id = scriptID;
  _cachedScript.script = scriptObj;
  updateScriptListItem(scriptID, scriptObj);
  return scriptObj;
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
  if (scriptObj.readOnly) {
    console.error('updateScript - script marked as readOnly', scriptObj);
    return;
  }
  console.log('updateScript', scriptID, scriptObj);
  const idbKey = `${SCRIPT_KEY_PREFIX}.${scriptID}`;
  return update(idbKey, (dbScriptObj) => {
    if (!dbScriptObj) {
      dbScriptObj = Object.assign({}, DEFAULT_SCRIPT_TEMPLATE);
    }
    Object.assign(dbScriptObj, scriptObj);
    dbScriptObj.lastSaved = Date.now();
    _cachedScript.id = scriptID;
    _cachedScript.script = dbScriptObj;
    updateScriptListItem(scriptID, dbScriptObj);
    saveScriptToFB(scriptID, dbScriptObj);
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
  if (_cachedScript.list) {
    return _cachedScript.list;
  }
  console.log('getScriptList');
  _cachedScript.list = await get(SCRIPT_LIST_KEY) || sampleScriptList;
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

async function updateScriptListItem(scriptID, scriptObj) {
  const listItem = {
    scriptID,
    title: scriptObj.title,
    snippet: scriptObj.snippet,
    lastUpdated: scriptObj.lastUpdated,
    hasStar: scriptObj.hasStar || false,
    readOnly: scriptObj.readOnly || false,
  };
  _cachedScript.list[scriptID] = listItem;
  set(SCRIPT_LIST_KEY, _cachedScript.list);
  saveScriptListToFB(_cachedScript.list);
}
