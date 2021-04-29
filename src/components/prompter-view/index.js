import { h, Component } from 'preact';
import style from './style.css';

import Eyeline from '../eyeline';

class PrompterView extends Component {
  state = {
    styles: this.getStyles(),
  };

  shouldComponentUpdate() {
    const styles = this.getStyles();
    this.setState({styles});
  }

  getStyles() {
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
    return style.join(';');
  }

  eyelineChange = (value) => {
    console.log('eyeline changed', value);
  }

  render(props) {
    return (
      <div style={this.state.styles}>
        <Eyeline value={props.eyelineHeight} onChange={this.eyelineChange} />
        <div id="pwapStart" class={style.boundary}>
          Start
        </div>
        <div class={style.view} dangerouslySetInnerHTML={{__html: props.asHTML}} />
        <div id="pwapEnd" class={style.boundary}>
          End
        </div>
      </div>
    );
  }
}

PrompterView.defaultProps = {
  eyelineHeight: 40,
  fontSize: 4,
  margin: 15,
  lineHeight: 120,
  allCaps: false,
  flipHorizontal: false,
  flipVertical: false,
};

export default PrompterView;
