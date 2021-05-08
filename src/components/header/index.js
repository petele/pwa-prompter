import { h } from 'preact';
import style from './style.css';

import { Account } from '../header-account';
import { Home, Edit, NewScript, Prompt } from '../header-buttons';


const Header = ({selectedRoute, scriptID}) => {

  return (
    <header class={style.header}>
      <nav>
        <Home />
      </nav>
      <h1>
        MyPrompter
      </h1>
      <nav>
        <Edit selectedRoute={selectedRoute} scriptID={scriptID} />
        <Prompt selectedRoute={selectedRoute} scriptID={scriptID} />
        <NewScript selectedRoute={selectedRoute} />
        <Account />
      </nav>
    </header>
  );
}

export default Header;
