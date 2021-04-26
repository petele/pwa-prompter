import { h } from 'preact';
import style from './style.css';

import PrompterFooter from '../../components/prompter-footer';

import PrompterView from '../../components/prompter-view';

const Prompter = ({ scriptID, scriptData }) => {

  console.log('scriptData', scriptData);

  return (
    <div class={style.prompter}>
      {/* <p>This is the prompter for a scriptID '{ scriptID }'.</p> */}
      {/* <Clock script-id={scriptID} /> */}
      <PrompterView scriptID={scriptID} />
      {/* <div>Current time: {new Date(time).toLocaleString()}</div> */}
      <PrompterFooter />
    </div>
  );
}

export default Prompter;
