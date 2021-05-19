import { h } from 'preact';

import { Account } from '../header-account';
import { Home, Edit, NewScript, Prompt } from '../header-buttons';


const Header = ({selectedRoute, scriptID, uid}) => {

  return (
    <nav class="navbar fixed-top navbar-dark bg-dark shadow">
      <div class="container-fluid">
        <Home />
        <div class="nav">
          <Edit selectedRoute={selectedRoute} scriptID={scriptID} />
          <Prompt selectedRoute={selectedRoute} scriptID={scriptID} />
          <NewScript selectedRoute={selectedRoute} />
          <Account uid={uid} />
        </div>
      </div>
    </nav>
  );
}

export default Header;
