/* eslint-disable prefer-template */
import { h, Component } from 'preact';
import style from './style.css';

import { getScript } from '../data-layer';

class PrompterView extends Component {
  state = {};

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    getScript(this.props.scriptID).then((val) => {
      this.setState(val);
    });
    // this.updateStyles();
  }

  shouldComponentUpdate() {
    this.updateStyles();
    // return false;
  }

  updateStyles() {
    const style = [];
    style.push(`font-size: ${this.props.fontSize}em`);
    style.push(`margin-left: ${this.props.margin}%`);
    style.push(`margin-right: ${this.props.margin}%`);
    style.push(`line-height: ${this.props.lineHeight}%`);
    if (this.props.allCaps) {
      style.push('text-transform: uppercase');
    }
    if (this.props.flipHorizontal) {
      style.push('transform: scaleX(-1)');
    }
    if (this.props.flipVertical) {
      style.push('transform: scaleY(-1)');
    }

    const styleStr = style.join(';');
    this.setState({style: styleStr});
  }

  render() {
    return (
      <div style={this.state.style}>
        <div id="pwapStart" class={style.boundary}>
          Start
        </div>
        <div class={style.view} dangerouslySetInnerHTML={{__html: this.state.asHTML}} />
        <div id="pwapEnd" class={style.boundary}>
          End
        </div>
      </div>
    );
  }
}

PrompterView.defaultProps = {
  fontSize: 4,
  margin: 15,
  lineHeight: 120,
  allCaps: false,
  flipHorizontal: false,
  flipVertical: false,
};

export default PrompterView;
