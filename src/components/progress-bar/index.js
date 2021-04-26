import { Component } from 'preact';
import style from './style.css';

class ProgressBar extends Component {

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    this.lastPercent;
    this.progressInterval = setInterval(() => {
      const newPercent = this.getPercentScrolled();
      if (this.lastPercent === newPercent) {
        return;
      }
      this.lastPercent = newPercent;
      const style = `width: ${Math.round(newPercent)}%;`;
      this.setState({scrollPositionStyle: style });
    }, 125);
  }

  componentWillUnmount() {
    clearInterval(this.progressInterval);
    this.progressInterval = null;
  }

  shouldComponentUpdate(nextProps) {
    const selectedRoute = nextProps.selectedRoute;
    if (selectedRoute?.startsWith('/prompter/')) {
      return true;
    }
    return false;
  }

  getPercentScrolled = () => {
    const currentY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    return Math.round((currentY / maxScroll) * 100);
  }

  render() {
    return (
      <div class={style.progress} style={this.state.scrollPositionStyle} />
    );
  }

}

export default ProgressBar;
