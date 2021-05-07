import { h } from 'preact';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';
import style from './style.css';

import { createNewScript } from '../../components/data-layer';

function isEditOrPrompt(selectedRoute) {
  if (selectedRoute?.startsWith('/editor/')) {
    return true;
  }
  if (selectedRoute?.startsWith('/prompter/')) {
    return true;
  }
  return false;
}

function isHome(selectedRoute) {
  if (selectedRoute === '/') {
    return true;
  }
  return false;
}

export const Edit = ({selectedRoute, scriptID}) => {
  if (isEditOrPrompt(selectedRoute)) {
    return (
      <Link activeClassName={style.active} href={`/editor/${scriptID}`}>
        Edit
      </Link>
    );
  }
  return ('');
}

export const Prompt = ({selectedRoute, scriptID}) => {
  if (isEditOrPrompt(selectedRoute)) {
    return (
      <Link activeClassName={style.active} href={`/prompter/${scriptID}`}>
        Prompt
      </Link>
    );
  }
  return ('');
}

export const NewScript = ({selectedRoute}) => {
  async function createScript() {
    const obj = await createNewScript();
    route(`/editor/${obj.scriptID}`, true);
  }
  if (isHome(selectedRoute)) {
    return (
      <Link class={style.newScript} onClick={createScript}>
        New Script
      </Link>
    );
  }
  return ('');
}

export const Account = () => {
  return (
    <Link activeClassName={style.active} href="/account">
      Account
    </Link>
  );
}

export const Home = () => {
  return (
    <Link activeClassName={style.active} href="/">
      Home
    </Link>
  );
}
