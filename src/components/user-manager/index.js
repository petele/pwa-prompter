
import { auth, database } from '../firebase';


export async function signIn(email, password) {
  try {
    const uCred = await auth.signInWithEmailAndPassword(email, password);
    console.log('[user_manager] Sign in succeeded', uCred.user);
    return {success: true};
  } catch (ex) {
    console.warn('[user_manager] Sign in failed', ex);
    return {
      success: false,
      message: 'Login failed',
      kind: 'todo',
    };
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    console.log('[user_manager] Sign out success.');
    return {success: true};
  } catch (ex) {
    console.warn('[ACCOUNT] Sign out failed.', ex);
    return {
      success: false,
      message: 'Logout failed.',
      kind: 'todo',
    }
  }
}

export async function createAccount(email, password, displayName) {
  try {
    const uCred = await auth.createUserWithEmailAndPassword(email, password);
    const user = uCred.user;
    console.log('[user_manager] Sign up success.');
    await user.updateProfile({displayName});
    console.log('[user_manager] Updated display name', displayName);
    await user.sendEmailVerification();
    console.log('[user_manager] Sent verification email.');
    const path = `userData/${user.uid}/profile/`;
    await database.ref(path).update({
      createdOn: Date.now(),
      emailAddress: email,
      displayName,
    });
    console.log('[user_manager] Updated profile info.');
    // TODO: Copy default script here.
    return {success: true};
  } catch (ex) {
    console.warn('[user_manager] Sign up failed.', ex);
    return {
      success: false,
      message: 'Unable to create new account',
      kind: 'todo',
    };
  }
}

export async function deleteAccount(email, password) {
  try {
    const uCred = await auth.signInWithEmailAndPassword(email, password);
    console.log('[user_manager] User re-authenticated.');
    const user = uCred.user;
    const userID = user.uid;
    const path = `userData/${userID}`;
    await database.ref(path).remove();
    console.log('[user_manager] Deleted cloud data.');
    await user.delete();
    console.log('[user_manager] User deleted.');
    return {success: true};
  } catch (ex) {
    console.warn('[account_manager] Delete account failed.', ex);
    return {
      success: false,
      message: 'Unable to delete account',
      kind: 'todo',
    };
  }
}

export async function changePassword(email, passwordCurrent, passwordA, passwordB) {
  if (passwordA !== passwordB) {
    console.warn('[user_manager] Failed. Passwords do not match!');
    return {
      success: false,
      message: 'Passwords do not match.',
      kind: 'todo',
    };
  }
  try {
    const uCred = await auth.signInWithEmailAndPassword(email, passwordCurrent);
    const user = uCred.user;
    await user.updatePassword(passwordA);
    return {success: true};
  } catch (ex) {
    console.warn('[user_manager] Password change failed.', ex);
    return {
      success: false,
      message: 'Password change failed.',
      kind: 'todo',
    };
  }
}

export async function forgotPassword(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    console.log('[account_manager] Password reset sent');
    return {success: true};
  } catch (ex) {
    console.warn('[account_manager] Password reset failed', ex);
    return {
      success: false,
      message: 'Unable to send password reset.',
      kind: 'todo',
    }
  }
}
