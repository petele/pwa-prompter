import { h } from 'preact';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';
import style from './style.css';

import { createNewScript } from '../../components/data-layer';

const Header = ({selectedRoute, scriptID}) => {

  async function createScript() {
    const obj = await createNewScript();
    route(`/editor/${obj.scriptID}`, true);
  }

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
      { (selectedRoute === '/') &&
        <nav>
          <Link class={style.newScript} onClick={createScript}>
            New
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
