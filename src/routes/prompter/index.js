import { h } from 'preact';
import style from './style.css';

import PrompterFooter from '../../components/prompter-footer';

import PrompterView from '../../components/prompter-view';

const Prompter = ({ asHTML }) => {

  return (
    <div class={style.prompter}>
      <PrompterView asHTML={asHTML}  />
      <PrompterFooter />
    </div>
  );
}

export default Prompter;
