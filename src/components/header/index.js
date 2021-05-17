import { h } from 'preact';
import style from './style.scss';

import { Account } from '../header-account';
import { Home, Edit, NewScript, Prompt } from '../header-buttons';


const Header = ({selectedRoute, scriptID, uid}) => {

  return (
    <nav class="navbar fixed-top">
      <div class="container-fluid">
        <Home />
        <div class={style.spacer} />
        <Edit selectedRoute={selectedRoute} scriptID={scriptID} />
        <Prompt selectedRoute={selectedRoute} scriptID={scriptID} />
        <NewScript selectedRoute={selectedRoute} />
        <Account uid={uid} />
      </div>
    </nav>
  );
}

export default Header;
