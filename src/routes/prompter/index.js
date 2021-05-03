import { h, Component, createRef } from 'preact';
import style from './style.css';

import PrompterFooter from '../../components/prompter-footer';
import ProgressBar from '../../components/progress-bar';
import PrompterScriptContainer from '../../components/prompter-script-container';
import Eyeline from '../../components/eyeline';

import { updateScript } from '../../components/data-layer';
import DefaultSettings from '../../components/default-prompter-settings';

class Prompter extends Component {
  _ref = createRef();
  state = {class: style.prompter};

  footerVisibleChange = (isVisible) => {
    this._ref.current.classList.toggle(style.footerHidden, !isVisible);
  }

  eyelineChange = async (value) => {
    await updateScript(this.props.scriptID, {eyelineHeight: value});
  }

  render(props, state) {
    return (
      <div id="docScroller" class={style.prompter} ref={this._ref}>
        <ProgressBar percent={state.percent} />
        <Eyeline value={props.eyelineHeight} margin={props.margin} onChange={this.eyelineChange} />
        <PrompterScriptContainer asHTML={props.asHTML} {...props}  />
        <PrompterFooter onFooterVisibleChange={this.footerVisibleChange} {...props} />
      </div>
    );
  }
}

Prompter.defaultProps = DefaultSettings;

export default Prompter;
