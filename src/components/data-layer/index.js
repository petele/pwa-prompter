
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

export async function get(key) {
  if (!key) {
    return null;
  }
  const fromLocal = getFromLocal(key);
  if (fromLocal) {
    return fromLocal;
  }
  const fromCloud = getFromCloud(key);
  if (fromCloud) {
    return fromCloud;
  }
  return null;
}

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

export async function getFromCloud(key) {
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

export async function save(data) {
  const key = data.key;
  data.lastSaved = Date.now();
  await idbSave(key, data);
  await fbSave(key, data);
  return data;
}

export async function del(key) {
  const now = Date.now();
  await idbDel(key, now);
  await fbDel(key, now);
  return key;
}

export async function list() {
  const local = await idbList();
  if (local) {
    return local.filter(item => !item.deleted);
  }
}

export async function removeLocalData() {
  return idbClear();
}

export async function removeCloudData() {
  return fbDeleteAllUserData();
}

export async function sync() {
  const list = await fbList();
  if (!list) {
    console.warn('[DataLayer] Server unavailable.');
    return;
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
}

export async function createSampleScript() {
  const data = await fbGetSampleScript();
  data.key = 'sample';
  const now = Date.now();
  data.createdOn = now;
  data.lastUpdated = now;
  save(data);
}

async function _syncToFirebase(key, timeDeleted) {
  console.log('[compareAndSync]', key, 'syncToFirebase');
  if (timeDeleted) {
    return await fbDel(key, timeDeleted);
  }
  const local = await idbGet(key);
  fbSave(key, local);
}

async function _syncFromFirebase(key, timeDeleted) {
  console.log('[compareAndSync]', key, 'syncFromFirebase');
  if (timeDeleted) {
    return await idbDel(key, timeDeleted)
  }
  const remote = await fbGet(key);
  await idbSave(key, remote);
}

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
