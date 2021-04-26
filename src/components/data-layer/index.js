/* eslint-disable quote-props */

import { get, set, update, del, keys } from 'idb-keyval';

const SCRIPT_TEMPLATE = {
  asHTML: '',
  asQuill: '',
  createdOn: Date.now(),
  hasStar: false,
  lastUpdated: Date.now(),
  prompterOptions: {},
  snippet: '',
  title: 'Untitled Script',
};

const cachedScript = {
  scriptID: null,
  scriptData: null,
};

let scriptList = {};

export async function getScript(scriptID) {
  if (cachedScript.scriptID === scriptID) {
    console.log('getScript [cached]', scriptID);
    return cachedScript.scriptData;
  }
  console.log('getScript', scriptID);
  const idbKey = `script.${scriptID}`;
  const scriptObj = await get(idbKey);
  if (scriptObj) {
    return scriptObj;
  }
  return Object.assign({}, SCRIPT_TEMPLATE);
}

export async function updateScript(scriptID, scriptObj) {
  console.log('updateScript', scriptID, scriptObj);
  const idbKey = `script.${scriptID}`;
  update(idbKey, (dbScriptObj) => {
    if (!dbScriptObj) {
      dbScriptObj = Object.assign({}, SCRIPT_TEMPLATE);
    }
    Object.assign(dbScriptObj, scriptObj);
    cachedScript.scriptID = scriptID;
    cachedScript.scriptData = dbScriptObj;
    return dbScriptObj;
  });
}

export async function saveScript(scriptID, scriptObj) {
  console.log('saveScript', scriptID, scriptObj);
  const idbKey = `script.${scriptID}`;
  scriptObj.scriptID = scriptID;
  cachedScript.scriptID = scriptID;
  cachedScript.scriptData = scriptObj;
  await set(idbKey, scriptObj);
  updateScriptListItem(scriptID, scriptObj);
}

export async function deleteScript(scriptID) {
  console.log('deleteScript', scriptID);
  const idbKey = `script.${scriptID}`;
  await del(idbKey);
  if (cachedScript.scriptID === scriptID) {
    cachedScript.scriptID = null;
    cachedScript.scriptData = null;
  }
  delete scriptList[scriptID];
}

function updateScriptListItem(scriptID, scriptObj) {
  const listItem = {
    scriptID,
    title: scriptObj.title,
    snippet: scriptObj.snippet,
    lastUpdated: scriptObj.lastUpdated,
    hasStar: scriptObj.hasStar || false,
  };
  scriptList[scriptID] = listItem;
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
  await set('scriptList', scriptList);
  return scriptList;
}

export async function getScriptList() {
  console.log('getScriptList');
  const idbKey = `scriptList`;
  const scriptList = await get(idbKey) || {};
  return scriptList;
}
