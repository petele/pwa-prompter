import { Component } from 'preact';
import style from './style.css';

class ProgressBar extends Component {
  scrollerRef = null;

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

  getScrollContainer() {
    if (this.scrollerRef) {
      return this.scrollerRef;
    }
    this.scrollerRef = document.getElementById('docScroller');
    return this.scrollerRef;
  }

  getPercentScrolled = () => {
    const scrollContainer = this.getScrollContainer();
    if (!scrollContainer) {
      return 0;
    }
    const currentY = scrollContainer.scrollTop;
    const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
    return Math.round((currentY / maxScroll) * 100);
  }

  render() {
    return (
      <div class={style.progress} style={this.state.scrollPositionStyle} />
    );
  }

}

export default ProgressBar;
