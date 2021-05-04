/* eslint-disable quote-props */

import { get, set, update, del, keys } from 'idb-keyval';

const DEFAULT_SCRIPT_TEMPLATE = {
  asHTML: '',
  asQuill: '',
  snippet: '',
  createdOn: Date.now(),
  hasStar: false,
  lastUpdated: Date.now(),
  title: 'Untitled Script',
};

const _cachedScript = {
  id: null,
  script: null,
};

let _cachedScriptList = {};

export async function getScript(scriptID) {
  if (_cachedScript.id === scriptID) {
    console.log('getScript', scriptID, '[cached]');
    return _cachedScript.script;
  }
  console.log('getScript', scriptID, '[db]');
  const idbKey = `script.${scriptID}`;
  const scriptObj = await get(idbKey);
  if (scriptObj) {
    _cachedScript.id = scriptID;
    _cachedScript.script = scriptObj;
    return scriptObj;
  }
  console.log('getScript', scriptID, '[new]');
  return Object.assign({}, DEFAULT_SCRIPT_TEMPLATE);
}

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
  const idbKey = `script.${scriptID}`;
  return await update(idbKey, (dbScriptObj) => {
    if (!dbScriptObj) {
      dbScriptObj = Object.assign({}, DEFAULT_SCRIPT_TEMPLATE);
    }
    Object.assign(dbScriptObj, scriptObj);
    _cachedScript.id = scriptID;
    _cachedScript.script = dbScriptObj;
    return dbScriptObj;
  });
}

// export async function saveScript(scriptID, scriptObj) {
//   console.log('saveScript', scriptID, scriptObj);
//   const idbKey = `script.${scriptID}`;
//   scriptObj.scriptID = scriptID;
//   _cachedScript.id = scriptID;
//   _cachedScript.script = scriptObj;
//   await set(idbKey, scriptObj);
//   updateScriptListItem(scriptID, scriptObj);
// }

export async function deleteScript(scriptID) {
  console.log('deleteScript', scriptID);
  const idbKey = `script.${scriptID}`;
  await del(idbKey);
  if (_cachedScript.id === scriptID) {
    _cachedScript.id = null;
    _cachedScript.script = null;
  }
  delete _cachedScriptList[scriptID];
}

function updateScriptListItem(scriptID, scriptObj) {
  const listItem = {
    scriptID,
    title: scriptObj.title,
    snippet: scriptObj.snippet,
    lastUpdated: scriptObj.lastUpdated,
    hasStar: scriptObj.hasStar || false,
  };
  _cachedScriptList[scriptID] = listItem;
}

export async function updateScriptList() {
  console.log('updateScriptList');
  const scriptKeys = await keys();
  for (let key of scriptKeys) {
    if (key.startsWith('script.')) {
      const scriptObj = await get(key);
      const scriptID = key.replace('script.', '');
      updateScriptListItem(scriptID, scriptObj);
    }
  }
  await set('scriptList', _cachedScriptList);
  return _cachedScriptList;
}

export async function getScriptList() {
  console.log('getScriptList');
  const idbKey = `scriptList`;
  const scriptList = await get(idbKey) || {};
  return scriptList;
}
