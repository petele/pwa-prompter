import { h, Component } from 'preact';
import style from './style.css';

import PrompterFooter from '../../components/prompter-footer';

import PrompterView from '../../components/prompter-view';

class Prompter extends Component {
  state = {class: style.prompter};

  footerVisibleChange = (isVisible) => {
    // console.log('footerVisibleChange', isVisible);
    if (isVisible) {
      this.setState({class: style.prompter});
      return;
    }
    this.setState({class: `${style.prompter} ${style.footerHidden}`});
  }

  render() {
    return (
      <div id="docScroller" class={this.state.class}>
        <PrompterView asHTML={this.props.asHTML}  />
        <PrompterFooter onFooterVisibleChange={this.footerVisibleChange} />
      </div>
    );
  }
}

export default Prompter;
