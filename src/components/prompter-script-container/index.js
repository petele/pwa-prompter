import { h, Component } from 'preact';
import style from './style.css';

class PrompterScriptContainer extends Component {
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

  render(props, state) {
    return (
      <div style={state.styles}>
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

PrompterScriptContainer.defaultProps = {
  fontSize: 4,
  margin: 15,
  lineHeight: 120,
  allCaps: false,
  flipHorizontal: false,
  flipVertical: false,
};

export default PrompterScriptContainer;
