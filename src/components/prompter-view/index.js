/* eslint-disable prefer-template */
import { h, Component } from 'preact';
import style from './style.css';

class PrompterView extends Component {
  state = {
    markup: this.props.asHTML,
    styles: this.getStyles(),
  };

  // componentDidMount() {
  // }

  shouldComponentUpdate() {
    // console.log('shouldComponentUpdate');
    const styles = this.getStyles();
    const markup = this.props.asHTML;
    this.setState({markup, styles});
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log('componentDidUpdate', prevProps, prevState, snapshot);
  // }

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

  render() {
    return (
      <div style={this.state.styles}>
        <div id="pwapStart" class={style.boundary}>
          Start
        </div>
        <div class={style.view} dangerouslySetInnerHTML={{__html: this.state.markup}} />
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
