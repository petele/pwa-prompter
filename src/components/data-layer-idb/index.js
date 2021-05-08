
import {
  get as idbGet,
  set as idbSet,
  del as idbDel,
  keys as idbKeys,
  clear as idbClear,
  values as idbValues,
  createStore as idbCreateStore,
} from 'idb-keyval';

const _storeList = idbCreateStore('pwapList', 'items');
const _storeCache = idbCreateStore('pwapCache', 'scripts');

export async function list() {
  return idbValues(_storeList);
}

export async function keys() {
  return idbKeys(_storeList);
}

export async function get(key) {
  return idbGet(key, _storeCache);
}

export async function getMetadata(key) {
  return idbGet(key, _storeList);
}

export async function save(key, data) {
  data.key = key;
  const metadata = {
    key,
    deleted: data.deleted,
    hasLocalCopy: true,
    title: data.title,
    snippet: data.snippet,
    createdOn: data.createdOn,
    lastUpdated: data.lastUpdated,
    lastSaved: data.lastSaved,
    hasStar: data.hasStar || false,
    readOnly: data.readOnly || false,
  };
  await idbSet(key, data, _storeCache);
  await idbSet(key, metadata, _storeList);
}

export async function del(key, now) {
  await idbDel(key, _storeCache);
  const metadata = {
    key,
    deleted: true,
    lastSaved: now,
  };
  await idbSet(key, metadata, _storeList);
}

export async function clear() {
  await idbClear(_storeList);
  await idbClear(_storeCache);
}
