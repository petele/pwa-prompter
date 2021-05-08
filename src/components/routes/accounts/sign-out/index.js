import { h } from 'preact';
import style from './style.css';

import { auth } from '../../../firebase';
import { removeLocalData} from '../../../data-layer';

const SignOut = () => {

  async function signOut() {
    try {
      await auth.signOut();
      await removeLocalData();
      console.log('[ACCOUNT] Sign out success.');
    } catch (ex) {
      console.warn('[ACCOUNT] Sign out failed.', ex);
    }
  }

  return (
    <button class={style.button} type="button" onClick={signOut}>
      Sign out
    </button>
  );
}

export default SignOut;
