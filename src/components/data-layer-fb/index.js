import { database, getUserID } from '../firebase';

export async function list() {
  const userID = getUserID();
  if (!userID) {
    return;
  }
  const path = `userData/${userID}/scriptList`;
  const snapshot = await database.ref(path).get();
  if (snapshot.exists()) {
    return snapshot.val();
  }
}

export async function get(key) {
  const fbPath = _getFBScriptPath(key);
  if (!fbPath) {
    return;
  }
  const snapshot = await database.ref(fbPath).get();
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return;
}

export async function save(key, data) {
  const userID = getUserID();
  if (!userID) {
    return;
  }
  data.key = key;
  const metadata = {
    key,
    title: data.title,
    snippet: data.snippet,
    createdOn: data.createdOn,
    lastUpdated: data.lastUpdated,
    lastSaved: data.lastSaved,
    hasStar: data.hasStar || false,
    readOnly: data.readOnly || false,
  };
  database.ref(_getFBScriptPath(key)).set(data);
  database.ref(_getFBMetadataPath(key)).set(metadata);
}

export async function del(key, now) {
  const userID = getUserID();
  if (!userID) {
    return;
  }
  const metadata = {
    key,
    deleted: true,
    lastSaved: now,
  };
  database.ref(_getFBScriptPath(key)).remove();
  database.ref(_getFBMetadataPath(key)).set(metadata);
}

function _getFBScriptPath(key) {
  const fbUserID = getUserID();
  if (fbUserID) {
    return `userData/${fbUserID}/scripts/${key}`;
  }
  return;
}

function _getFBMetadataPath(key) {
  const fbUserID = getUserID();
  if (fbUserID) {
    return `userData/${fbUserID}/scriptList/${key}`;
  }
  return;
}
