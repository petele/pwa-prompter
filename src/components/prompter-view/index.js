import { h, Component } from 'preact';
import style from './style.css';

import Eyeline from '../eyeline';

class PrompterView extends Component {
  state = {
    styles: this.getStyles(),
  };

  shouldComponentUpdate(nextProps) {
    const styles = this.getStyles(nextProps);
    this.setState({styles});
  }

  getStyles(props) {
    if (!props) {
      props = this.props;
    }
    console.log('props', props);
    const style = [];
    style.push(`font-size: ${props.fontSize}em`);
    style.push(`margin-left: ${props.margin}%`);
    style.push(`margin-right: ${props.margin}%`);
    style.push(`line-height: ${props.lineHeight}%`);
    if (props.allCaps) {
      style.push('text-transform: uppercase');
    }
    if (props.flipHorizontal) {
      style.push('transform: scaleX(-1)');
    }
    if (props.flipVertical) {
      style.push('transform: scaleY(-1)');
    }
    return style.join(';');
  }

  eyelineChange = (value) => {
    console.log('eyeline changed', value);
  }

  render(props, state) {
    return (
      <div style={state.styles}>
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
  eyelineHeight: 25,
  fontSize: 4,
  margin: 15,
  lineHeight: 120,
  allCaps: false,
  flipHorizontal: false,
  flipVertical: false,
};

export default PrompterView;
