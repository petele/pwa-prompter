import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

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

export const Home = () => {
  return (
    <Link activeClassName={style.active} href="/">
      Home
    </Link>
  );
}

export const NewScript = ({selectedRoute}) => {
  if (isHome(selectedRoute)) {
    return (
      <Link activeClassName={style.active} href="/editor/new">
        New Script
      </Link>
    );
  }
  return ('');
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

export const Account = () => {
  return (
    <Link activeClassName={style.active} href="/account">
      Account
    </Link>
  );
}
