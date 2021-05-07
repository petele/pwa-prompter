
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
} from '../data-layer-fb';

const _cachedScript = {
  key: null,
  data: null,
};

export async function get(key) {
  if (_cachedScript?.key === key) {
    return _cachedScript.data;
  }
  const local = await idbGet(key);
  if (local) {
    _updateCachedScript(local);
    return local;
  }
  const cloud = await fbGet(key);
  if (cloud) {
    _updateCachedScript(local);
    idbSave(key, cloud);
    return cloud;
  }
}

export async function save(data) {
  const key = data.key;
  data.lastSaved = Date.now();
  _updateCachedScript(data);
  idbSave(key, data);
  fbSave(key, data);
}

export async function del(key) {
  const now = Date.now();
  if (_cachedScript.key === key) {
    _updateCachedScript(null);
  }
  await idbDel(key, now);
  fbDel(key, now);
}

export async function list() {
  const local = await idbList();
  if (local) {
    return local.filter(item => !item.deleted);
  }
}

export async function removeLocalData() {
  _updateCachedScript(null);
  return idbClear();
}

export async function sync() {
  const list = await fbList();
  if (!list) {
    console.warn('[DataLayer] Server unavailable.');
    return;
  }
  const keysInFB = Object.keys(list);
  for (const key of keysInFB) {
    await _compareAndSyncScript(key, list[key]);
  }
  const keysInIDB = await idbKeys();
  const diff = keysInIDB.filter(x => !keysInFB.includes(x));
  diff.forEach(async (key) => {
    _syncToFirebase(key);
  });
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
    console.log('[compareAndSync]', key, 'equal');
    return;
  }
  if (localMeta.lastSaved > remoteMeta.lastSaved) {
    const timeDeleted = localMeta.deleted ? localMeta.lastSaved : null;
    await _syncToFirebase(key, timeDeleted);
    return;
  }
  console.error('[DataLayer:comareAndSync] No good!', localMeta, remoteMeta);
}

function _updateCachedScript(data) {
  _cachedScript.key = data?.key;
  _cachedScript.data = data;
}
