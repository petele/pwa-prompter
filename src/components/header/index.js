import { h } from 'preact';
import style from './style.css';

import { Account } from '../header-account';
import { Home, Edit, NewScript, Prompt } from '../header-buttons';


const Header = ({selectedRoute, scriptID, uid}) => {

  return (
    <header class={style.header}>
      <nav>
        <Home />
        <div class={style.spacer} />
        <Edit selectedRoute={selectedRoute} scriptID={scriptID} />
        <Prompt selectedRoute={selectedRoute} scriptID={scriptID} />
        <NewScript selectedRoute={selectedRoute} />
        <Account uid={uid} />
      </nav>
    </header>
  );
}

export default Header;
