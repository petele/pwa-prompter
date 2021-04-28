import { h, Component } from 'preact';
import style from './style.css';

class PrompterFooter extends Component {
  footerRef = null;
  scrollerRef = null;
  scrollingRAF = null;
  state = {
    playButtonText: 'Play',
    hidePlay: '',
    hidePause: style.hidden,
    fullScreenStyle: '',
  };

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (this.scrollerRef) {
      return;
    }
    this.setScrollSpeed(this.props.scrollSpeed);
    this.scrollerRef = document.getElementById('docScroller');
    window.addEventListener('keydown', this.keyboardHandler);
    document.addEventListener('fullscreenchange', this.fullScreenChanged);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyboardHandler);
    document.removeEventListener('fullscreenchange', this.fullScreenChanged);
    if (this.scrollingRAF) {
      cancelAnimationFrame(this.scrollingRAF);
      this.scrollingRAF = null;
    }
    if (this.hideFooterTimer) {
      clearTimeout(this.hideFooterTimer);
      this.hideFooterTimer = null;
    }
  }

  fullScreenChanged = () => {
    const value = document.fullscreenElement ? style.enabled : '';
    this.setState({fullScreenStyle: value});
  }

  keyboardHandler = (e) => {
    // e.preventDefault();
    console.log('key', e.code, e.ctrlKey, e.metaKey, e.shiftKey, e.key);

    const keyCode = e.code;

    if (keyCode === 'Space') {
      if (this.scrollingRAF) {
        this.scrollStop();
        return;
      }
      this.scrollStart();
      return;
    }
    if (keyCode === 'ArrowUp') {
      return this.backClick();
    }
    if (keyCode === 'ArrowDown') {
      return this.forwardClick();
    }
    if (keyCode === 'Escape') {
      return this.resetClick();
    }
    if (keyCode === 'ArrowLeft') {
      const newSpeed = this.state.scrollSpeed - 10;
      this.setScrollSpeed(newSpeed);
      return;
    }
    if (keyCode === 'ArrowRight') {
      const newSpeed = this.state.scrollSpeed + 10;
      this.setScrollSpeed(newSpeed);
      return;
    }
    if (keyCode === 'BracketLeft') {
      console.log('previous');
      return;
    }
    if (keyCode === 'BracketRight') {
      console.log('next');
      return;
    }
    if (keyCode === 'KeyF') {
      this.fullscreenClick();
      return;
    }
  }

  setScrollSpeed = (newSpeed) => {
    this.setState((prevState) => {
      if (prevState.scrollSpeedRaw === newSpeed) {
        return null;
      }
      if (newSpeed < 1 || newSpeed > 1000) {
        console.log('out of bounds', newSpeed);
        return null;
      }
      console.log('setSpeed', newSpeed);
      if (this.props.onScrollSpeedChange) {
        this.props.onScrollSpeedChange(newSpeed);
      }
      return {
        scrollSpeed: newSpeed,
        scrollSpeedPercent: newSpeed / 100,
      };
    });
  }

  fullscreenClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    this.scrollerRef.requestFullscreen();
  }

  playClick = (e) => {
    // TODO: Fix focus problem, if user clicks, then hits keyboard shortcut
    // item is fired twice, once for the keyboard, once for the focused click.
    if (e && e.x === 0 && e.y === 0) {
      return;
    }
    if (this.scrollingRAF) {
      this.scrollStop();
      return;
    }
    this.scrollStart();
  }

  scrollStart = () => {
    this.docScrollHeight = this.scrollerRef.scrollHeight;
    this.setState({
      playButtonText: 'Pause',
      hidePlay: style.hidden,
      hidePause: '',
    });
    this.doScrollStep(0);
    if (this.props.autoHideFooter) {
      this.hideFooterTimer = setTimeout(() => {
        if (this.scrollingRAF) {
          this.setFooterVisibility(false);
        }
      }, 2500);
    }
    // TODO: Add timer
    // this.start = Date.now();
  }

  scrollStop = () => {
    if (this.scrollingRAF) {
      cancelAnimationFrame(this.scrollingRAF);
      this.scrollingRAF = null;
    }
    this.setState({
      playButtonText: 'Play',
      hidePlay: '',
      hidePause: style.hidden,
    });
    this.setFooterVisibility(true);
  }

  doScrollStep = (lastScrollAmount) => {
    const currentY = this.scrollerRef.scrollTop;
    const scrollSpeed = this.state.scrollSpeedPercent;
    const scrollAmount = scrollSpeed + (lastScrollAmount || 0);
    const scrollBy = Math.floor(scrollAmount);
    let scrollRemainder = scrollAmount;
    if (scrollBy >= 1) {
      this.scrollerRef.scrollBy({top: scrollBy});
      scrollRemainder -= scrollBy;
    }
    if (currentY + window.innerHeight >= this.docScrollHeight) {
      this.scrollStop();
      return;
    }
    this.scrollingRAF = window.requestAnimationFrame(() => {
      this.doScrollStep(scrollRemainder);
    });
  }

  resetClick = () => {
    if (this.scrollingRAF) {
      this.scrollStop();
    }
    this.scrollerRef.scrollTo({top: 0, behavior: 'smooth'});
  }

  backClick = () => {
    const isScrolling = this.scrollingRAF;
    if (isScrolling) {
      this.scrollStop();
    }
    this.scrollerRef.scrollBy({top: -150, behavior: 'smooth'});
    if (isScrolling) {
      setTimeout(this.scrollStart, 400);
    }
  }

  forwardClick = () => {
    const isScrolling = this.scrollingRAF;
    if (isScrolling) {
      this.scrollStop();
    }
    this.scrollerRef.scrollBy({top: 150, behavior: 'smooth'});
    if (isScrolling) {
      setTimeout(this.scrollStart, 400);
    }
  }

  toggleFooterClick = () => {
    const isVisible = this.footerRef.classList.contains(style.minimized);
    this.setFooterVisibility(isVisible)
  }

  setFooterVisibility = (isVisible) => {
    if (this.hideFooterTimer) {
      clearTimeout(this.hideFooterTimer);
      this.hideFooterTimer = null;
    }
    this.footerRef.classList.toggle(style.minimized, !isVisible);
    if (this.props.onFooterVisibleChange) {
      this.props.onFooterVisibleChange(isVisible);
    }
  }

  render() {
    return (
      <footer class={style.footer} ref={el => { this.footerRef = el }}>
        <div class={style.toggle}>
          <button onClick={this.toggleFooterClick} type="button">
            &bull;&bull;&bull;
          </button>
        </div>
        <div class={style.settingsContainer}>
          settings
        </div>
        <nav>
          <button id="reset" onClick={this.resetClick} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M12 4c-.21 0-.42.02-.62.04l1.83-1.83L11.8.8 7.59 5l4.21 4.21 1.41-1.41-1.75-1.75c.18-.02.35-.05.54-.05 3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7H3c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9z" />
              <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" />
            </svg>
            <div>Reset</div>
          </button>
          <button id="skipBack" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6zm6.5 2.14L12.97 12 16 9.86v4.28z" />
            </svg>
            <div>Previous</div>
          </button>
          <button id="rw" onClick={this.backClick} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M18 9.86v4.28L14.97 12 18 9.86m-9 0v4.28L5.97 12 9 9.86M20 6l-8.5 6 8.5 6V6zm-9 0l-8.5 6 8.5 6V6z" />
            </svg>
            <div>Back</div>
          </button>
          <button id="pause" onClick={this.playClick} type="button">
            {/* PLAY */}
            <svg class={this.state.hidePlay} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z" />
            </svg>
            {/* PAUSE */}
            <svg class={this.state.hidePause} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 19h-6V5h6v14zm-4-2h2V7h-2v10zm-4 2H5V5h6v14zm-4-2h2V7H7v10z" />
            </svg>
            <div>{this.state.playButtonText}</div>
          </button>
          <button id="ff" onClick={this.forwardClick} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M15 9.86L18.03 12 15 14.14V9.86m-9 0L9.03 12 6 14.14V9.86M13 6v12l8.5-6L13 6zM4 6v12l8.5-6L4 6z" />
              <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" />
            </svg>
            <div>Forward</div>
          </button>
          <button id="skipForward" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
            </svg>
            <div>Next</div>
          </button>
          <button id="fullScreen" class={this.state.fullScreenStyle}  onClick={this.fullscreenClick} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
            <div>Full Screen</div>
          </button>
          <button id="settings" type="button" style="display:none;">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56c-.03.26-.06.53-.06.79s.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z" />
              <circle cx="12" cy="12" r="3.5" />
            </svg>
            <div>Settings</div>
          </button>
        </nav>
      </footer>
    );
  }
}

PrompterFooter.defaultProps = {
  scrollSpeed: 175,
  autoHideFooter: false,
};

export default PrompterFooter;
