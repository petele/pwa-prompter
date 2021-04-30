import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = ({selectedRoute, scriptID}) => {
  return (
    <header class={style.header}>
      <nav>
        <Link activeClassName={style.active} href="/">Home</Link>
      </nav>
      <h1>
        MyPrompter
      </h1>
      { (selectedRoute?.startsWith('/editor/') || selectedRoute?.startsWith('/prompter/')) &&
        <nav>
          <Link activeClassName={style.active} href={`/editor/${scriptID}`}>
            Edit
          </Link>
          <Link activeClassName={style.active} href={`/prompter/${scriptID}`}>
            Prompt
          </Link>
        </nav>
      }
      <nav>
        <Link activeClassName={style.active} href="/account">
          Account
        </Link>
      </nav>
    </header>
  );
}

export default Header;
