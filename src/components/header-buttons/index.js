import { h } from 'preact';
import { Link } from 'preact-router/match';

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
  if (selectedRoute === '/app') {
    return true;
  }
  return false;
}

export const Home = () => {
  return (
    <Link class="navbar-brand" activeClassName="active" href="/app" label="Home" aria-label="Home">
      MyPrompter
    </Link>
  );
}

export const NewScript = ({selectedRoute}) => {
  if (!isHome(selectedRoute)) {
    return ('');
  }
  return (
    <Link class="nav-link" activeClassName="active" href="/editor/new" title="Create new script" aria-label="new">
      <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    </Link>
  );
}

export const Edit = ({selectedRoute, scriptID}) => {
  if (!isEditOrPrompt(selectedRoute)) {
    return ('');
  }
  return (
    <Link class="nav-link" activeClassName="active" href={`/editor/${scriptID}`} title="Switch to edit view" aria-label="edit">
      <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
      </svg>
    </Link>
  );
}

export const Prompt = ({selectedRoute, scriptID}) => {
  if (!isEditOrPrompt(selectedRoute)) {
    return ('');
  }
  return (
    <Link class="nav-link" activeClassName="active" href={`/prompter/${scriptID}`} title="Switch to prompter view" aria-label="prompter">
      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF">
        <g>
          <rect fill="none" height="24" width="24" />
          <g>
            <path d="M19,5v14H5V5H19 M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3L19,3z" />
          </g>
          <path d="M14,17H7v-2h7V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z" />
        </g>
      </svg>
    </Link>
  );
}

export const About = () => {
  return (
    <Link class="nav-link" activeClassName="active" href="/about" title="About" aria-label="About">
      <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#ffffff">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
      </svg>
    </Link>
  );
}
