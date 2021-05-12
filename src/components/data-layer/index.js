
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
 * Get's the specified script.
 *   Checks cache first, then idb, then cloud.
 *
 * @param {String} key script key
 * @returns {Promise<!Object>}
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
 * @param {String} key Script key
 * @returns {Promise<!Object>}
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
 * @param {String} key Script key
 * @returns {Promise<!Object>}
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
 * @param {Object} data Script object to save
 * @returns {Promise<Object>}
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
 * @param {String} key Script key
 * @returns {Promise<String>}
 */
export async function del(key) {
  const now = Date.now();
  await idbDel(key, now);
  await fbDel(key, now);
  return key;
}

/**
 * Gets the list of scripts available on the local device.
 *
 * @returns {Promise<Array>}
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
 * @returns {Promise<Boolean>} True on successful removal.
 */
export async function removeLocalData() {
  return idbClear();
}

/**
 * Removes all data from Firebase.
 *
 * @returns {Promise<Boolean>} True on successful removal.
 */
export async function removeFirebaseData() {
  return fbDeleteAllUserData();
}

/**
 * Creates and saves a sample script object.
 *
 * @returns {Promise<Object>} Script object
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
 * @returns {Promise<Boolean>} True on successful sync.
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
 * @param {String} key Script key
 * @param {Integer} [timeDeleted] Time the script was deleted
 * @returns {Promise}
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
 * @param {String} key Script key
 * @param {Integer} [timeDeleted] Time the script was deleted
 * @returns {Promise}
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
 * @param {String} key Script key
 * @param {Object} remoteMeta Metadata of script object from remote
 * @returns {Promise}
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
