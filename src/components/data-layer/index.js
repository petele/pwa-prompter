
import {
  get as idbGet,
  getMetadata as idbGetMetadata,
  save as idbSave,
  del as idbDel,
  list as idbList,
  keys as idbKeys,
  clear as idbClear,
} from '../data-layer-idb';

import {
  get as fbGet,
  save as fbSave,
  del as fbDel,
  list as fbList,
  getSampleScript as fbGetSampleScript,
  deleteAllUserData as fbDeleteAllUserData,
} from '../data-layer-fb';

/**
 * Script object
 *
 * @typedef {object} Script
 * @property {string} key - Script identifier
 * @property {number} createdOn - Date script was created (Unix epoch)
 * @property {number} lastSaved - Date script was last saved to the datastore (Unix epoch)
 * @property {number} lastUpdated - Date script was last changed (Unix epoch)
 * @property {string} title - Title of script
 * @property {Array} asQuill - Script text as Quill Delta
 * @property {string} asHTML - Script text as HTML
 * @property {string} snippet - Summary snippet of the script text
 * @property {boolean} hasStar - User has marked script as favorite
 * @property {boolean} [readOnly] - Script is read only
 *
 * The following properties are for the prompter view
 * @property {boolean} [allCaps] - All caps
 * @property {boolean} [autoHideFooter] - Hide footer when scrolling
 * @property {number} [eyelineHeight] - Height of eyeline icon
 * @property {boolean} [flipHorizontal] - Flip the script horizontally
 * @property {boolean} [flipVertical] - Flip the script vertically
 * @property {number} [fontSize] - Font size to use
 * @property {number} [lineHeight] - Line height, as a percentage of normal.
 * @property {number} [margin] - Left and right margin
 * @property {number} [scrollSpeed] - Speed the prompter scrolls
 */

/**
 * Script Metadata object
 *
 * @typedef {object} ScriptMeta
 * @property {string} key - Script identifier
 * @property {number} createdOn - Date script was created (Unix epoch)
 * @property {number} lastSaved - Date script was last saved to the datastore (Unix epoch)
 * @property {number} lastUpdated - Date script was last changed (Unix epoch)
 * @property {string} title - Title of script
 * @property {string} snippet - Summary snippet of the script text
 * @property {boolean} hasStar - User has marked script as favorite
 * @property {boolean} [readOnly] - Script is read only
 */

/**
 * Get's the specified script.
 *   Checks cache first, then idb, then cloud.
 *
 * @param {string} key script key
 * @returns {Promise<!Script>}
 */
export async function get(key) {
  if (!key) {
    return null;
  }
  const fromLocal = getFromLocal(key);
  if (fromLocal) {
    return fromLocal;
  }
  const fromFirebase = getFromFirebase(key);
  if (fromFirebase) {
    return fromFirebase;
  }
  return null;
}

/**
 * Get's the specified script from IDB.
 *
 * @param {string} key Script key
 * @returns {Promise<!Script>}
 */
export async function getFromLocal(key) {
  if (!key) {
    return null;
  }
  const local = await idbGet(key);
  if (local) {
    return local;
  }
  return null;
}

/**
 * Get's the specified script from the network.
 *
 * @param {string} key Script key
 * @returns {Promise<!Script>}
 */
export async function getFromFirebase(key) {
  if (!key) {
    return null;
  }
  const cloud = await fbGet(key);
  if (cloud) {
    idbSave(key, cloud);
    return cloud;
  }
  return null;
}

/**
 * Saves the script to IDB and Firebase.
 *
 * @param {Script} data Script object to save
 * @returns {Promise<!Script>}
 */
export async function save(data) {
  const key = data.key;
  data.lastSaved = Date.now();
  await idbSave(key, data);
  await fbSave(key, data);
  return data;
}

/**
 * Deletes a script from IDB and Firebase.
 *
 * @param {string} key Script key
 * @returns {Promise<undefined>}
 */
export async function del(key) {
  const now = Date.now();
  await idbDel(key, now);
  await fbDel(key, now);
}

/**
 * Gets the list of scripts available on the local device.
 *
 * @returns {Promise<ScriptMeta[]>}
 */
export async function list() {
  const local = await idbList();
  if (local) {
    return local.filter(item => !item.deleted);
  }
}

/**
 * Removes all cached local data.
 *
 * @returns {Promise<boolean>} True on successful removal.
 */
export async function removeLocalData() {
  return idbClear();
}

/**
 * Removes all data from Firebase.
 *
 * @returns {Promise<boolean>} True on successful removal.
 */
export async function removeFirebaseData() {
  return fbDeleteAllUserData();
}

/**
 * Creates and saves a sample script object.
 *
 * @returns {Promise<Script>} Script object
 */
export async function createSampleScript() {
  const data = await fbGetSampleScript();
  data.key = 'sample';
  const now = Date.now();
  data.createdOn = now;
  data.lastUpdated = now;
  await save(data);
  return data;
}

/**
 * Syncs the IDB datastore with the remote Firebase datastore.
 *
 * @returns {Promise<boolean>} True on successful sync.
 */
export async function sync() {
  const list = await fbList();
  if (!list) {
    console.warn('[DataLayer] Server unavailable.');
    return false;
  }
  // Compare FB store to local store...
  const keysInFB = Object.keys(list);
  for (const key of keysInFB) {
    await _compareAndSyncScript(key, list[key]);
  }
  // Compare local store to fb...
  const keysInIDB = await idbKeys();
  const diff = keysInIDB.filter(x => !keysInFB.includes(x));
  for (const key of diff) {
    await _syncToFirebase(key);
  }
  return true;
}

/**
 * Syncs an item from IDB to Firebase.
 *
 * @param {string} key Script key
 * @param {number} [timeDeleted] Time the script was deleted
 * @returns {Promise<undefined>}
 */
async function _syncToFirebase(key, timeDeleted) {
  console.log('[compareAndSync]', key, 'syncToFirebase');
  if (timeDeleted) {
    return await fbDel(key, timeDeleted);
  }
  const local = await idbGet(key);
  fbSave(key, local);
}

/**
 * Syncs an item from Firebase to IDB.
 *
 * @param {string} key Script key
 * @param {number} [timeDeleted] Time the script was deleted
 * @returns {Promise<undefined>}
 */
async function _syncFromFirebase(key, timeDeleted) {
  console.log('[compareAndSync]', key, 'syncFromFirebase');
  if (timeDeleted) {
    return await idbDel(key, timeDeleted)
  }
  const remote = await fbGet(key);
  await idbSave(key, remote);
}

/**
 * Compares a local script object to the remote metadata and syncs if required.
 *
 * @param {string} key Script key
 * @param {ScriptMeta} remoteMeta Metadata of script object from remote
 * @returns {Promise<undefined>}
 */
async function _compareAndSyncScript(key, remoteMeta) {
  const localMeta = await idbGetMetadata(key);
  if (!localMeta || localMeta.lastSaved < remoteMeta.lastSaved) {
    const timeDeleted = remoteMeta.deleted ? remoteMeta.lastSaved : null;
    await _syncFromFirebase(key, timeDeleted);
    return;
  }
  if (localMeta.lastSaved === remoteMeta.lastSaved) {
    return;
  }
  if (localMeta.lastSaved > remoteMeta.lastSaved) {
    const timeDeleted = localMeta.deleted ? localMeta.lastSaved : null;
    await _syncToFirebase(key, timeDeleted);
    return;
  }
  console.error('[comareAndSync] Error!', localMeta, remoteMeta);
}
