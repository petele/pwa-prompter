import { h } from 'preact';
import style from './style.scss';
import { Account } from '../header-account';
import { Home, Edit, NewScript, Prompt } from '../header-buttons';


const Header = ({selectedRoute, scriptID, uid}) => {

  const isPrompter = selectedRoute?.startsWith('/prompter/');

  return (
    <nav id="headNav" class="navbar fixed-top navbar-dark bg-dark shadow pt-0 pb-0">
      <div class="container-fluid pe-0">
        <Home />
        <div class="nav">
          <Edit selectedRoute={selectedRoute} scriptID={scriptID} />
          <Prompt selectedRoute={selectedRoute} scriptID={scriptID} />
          <NewScript selectedRoute={selectedRoute} />
          <Account uid={uid} />
        </div>
      </div>
      {isPrompter &&
        <div id="headerProgress" class={style.progress} style="width:0%;" />
      }
    </nav>
  );
}

export default Header;
