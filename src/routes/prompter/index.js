import { h, Component, createRef } from 'preact';
import style from './style.css';

import PrompterFooter from '../../components/prompter-footer';
import ProgressBar from '../../components/progress-bar';
import PrompterScriptContainer from '../../components/prompter-script-container';
import Eyeline from '../../components/eyeline';

class Prompter extends Component {
  _ref = createRef();
  state = {class: style.prompter};

  footerVisibleChange = (isVisible) => {
    this._ref.current.classList.toggle(style.footerHidden, !isVisible);
  }

  eyelineChange = (value) => {
    console.log('eyeline changed', value);
  }

  render(props) {
    return (
      <div id="docScroller" class={style.prompter} ref={this._ref}>
        <ProgressBar />
        <Eyeline value={props.prompterOptions?.eyelineHeight} margin={props.prompterOptions?.margin} onChange={this.eyelineChange} />
        <PrompterScriptContainer asHTML={props.asHTML} {...props.prompterOptions}  />
        <PrompterFooter onFooterVisibleChange={this.footerVisibleChange} {...props.prompterOptions} />
      </div>
    );
  }
}

export default Prompter;
