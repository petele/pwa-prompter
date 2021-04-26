import { h, Component } from 'preact';
import style from './style.css';

class PrompterFooter extends Component {
  footerRef = null;
  state = {
    playButtonText: 'Play',
    playButtonIcon: '/images/play_48dp.svg',
  };

  componentWillUnmount() {
    if (this.scrollingRAF) {
      cancelAnimationFrame(this.scrollingRAF);
      this.scrollingRAF = null;
      return;
    }
  }

  playClick = () => {
    if (this.scrollingRAF) {
      this.scrollStop();
      this.setState({
        playButtonText: 'Play',
        playButtonIcon: '/images/play_48dp.svg',
      });
      this.footerShow();
      return;
    }
    this.scrollStart();
    this.setState({
      playButtonText: 'Pause',
      playButtonIcon: '/images/pause_48dp.svg',
    });
    setTimeout(() => {
      if (this.scrollingRAF) {
        this.footerHide();
      }
    }, 2500);
  }

  scrollStart = () => {
    this.docScrollHeight = document.body.scrollHeight;
    this.doScrollStep(0);
    this.start = Date.now();
  }

  scrollStop = () => {
    if (this.scrollingRAF) {
      cancelAnimationFrame(this.scrollingRAF);
      this.scrollingRAF = null;
      return;
    }
  }

  doScrollStep = (lastScrollAmount) => {
    const currentY = window.scrollY;
    const scrollSpeed = this.props.scrollSpeed / 100;
    const scrollAmount = scrollSpeed + (lastScrollAmount || 0);
    const scrollBy = Math.floor(scrollAmount);
    let scrollRemainder = scrollAmount;
    if (scrollBy >= 1) {
      window.scrollBy({top: scrollBy});
      scrollRemainder -= scrollBy;
    }
    if (currentY + window.innerHeight >= this.docScrollHeight) {
      this.playClick();
      return;
    }
    this.scrollingRAF = window.requestAnimationFrame(() => {
      this.doScrollStep(scrollRemainder);
    });
  }

  resetClick = () => {
    if (this.scrollingRAF) {
      this.playClick();
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  backClick = () => {
    const isScrolling = this.scrollingRAF;
    if (isScrolling) {
      this.scrollStop();
    }
    window.scrollBy({top: -150, behavior: 'smooth'});
    if (isScrolling) {
      setTimeout(this.scrollStart, 400);
    }
  }

  forwardClick = () => {
    const isScrolling = this.scrollingRAF;
    if (isScrolling) {
      this.scrollStop();
    }
    window.scrollBy({top: 150, behavior: 'smooth'});
    if (isScrolling) {
      setTimeout(this.scrollStart, 400);
    }
  }

  footerShow = () => {
    this.footerRef.classList.toggle(style.minimized, false);
  }

  footerHide = () => {
    this.footerRef.classList.toggle(style.minimized, true);
  }

  toggleFooterClick = () => {
    this.footerRef.classList.toggle(style.minimized);
  }


  render() {
    return (
      <footer class={style.footer} ref={el => { this.footerRef = el }}>
        <div class={style.toggle}>
          <button onClick={this.toggleFooterClick} type="button">
            &bull;&bull;&bull;
          </button>
        </div>
        <nav>
          <button id="reset" onClick={this.resetClick} type="button">
            <img src="/images/replay_48dp.svg" />
            <div>Reset</div>
          </button>
          <button id="skipBack" type="button">
            <img src="/images/skip_previous_48dp.svg" />
            <div>Previous</div>
          </button>
          <button id="rw" onClick={this.backClick} type="button">
            <img src="/images/fast_rewind_48dp.svg" />
            <div>Back</div>
          </button>
          <button id="pause" onClick={this.playClick} type="button">
            <img src={this.state.playButtonIcon} />
            <div>{this.state.playButtonText}</div>
          </button>
          <button id="ff" onClick={this.forwardClick} type="button">
            <img src="/images/fast_forward_48dp.svg" />
            <div>Forward</div>
          </button>
          <button id="skipForward" type="button">
            <img src="/images/skip_next_48dp.svg" />
            <div>Next</div>
          </button>
          <button id="settings" type="button">
            <img src="/images/settings_48dp.svg" />
            <div>Settings</div>
          </button>
        </nav>
      </footer>
    );
  }
}

PrompterFooter.defaultProps = {
  scrollSpeed: 175,
};

export default PrompterFooter;
