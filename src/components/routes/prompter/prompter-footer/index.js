import { h, Component } from 'preact';
import style from './style.scss';

import DefaultSettings from '../default-prompter-settings';
import { getKeyCombination, getShortcut } from '../keyboard-shortcuts';
import * as scrollController from  '../scroll-controller';

class PrompterFooter extends Component {
  _footerRef = null;
  _hideFooterTimer = null;
  state = {
    playButtonText: 'Play',
    hidePlay: '',
    hidePause: style.hidden,
    fullScreenAvailable: document.fullscreenEnabled,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.keyboardHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyboardHandler);
    if (this._hideFooterTimer) {
      clearTimeout(this._hideFooterTimer);
      this._hideFooterTimer = null;
    }
    if (scrollController.isScrolling()) {
      scrollController.stop();
    }
  }

  keyboardHandler = (e) => {
    // const activeElem = document.activeElement;
    // console.log('key', activeElem, e.code, e.ctrlKey, e.metaKey, e.shiftKey, e.key);

    const combo = getKeyCombination(e);
    if (!combo) {
      return;
    }

    const shortcut = getShortcut(combo);
    if (!shortcut) {
      return;
    }

    console.log('keyboardShortcut', shortcut);

    if (shortcut === 'togglePlay') {
      e.preventDefault();
      return this.toggleScroller();
    }

    if (shortcut === 'skipBack') {
      e.preventDefault();
      return this.skipBackward();
    }

    if (shortcut === 'skipForward') {
      e.preventDefault();
      return this.skipForward();
    }

    if (shortcut === 'speedDown') {
      e.preventDefault();
      return this.adjustScrollSpeed(-5);
    }

    if (shortcut === 'speedUp') {
      e.preventDefault();
      return this.adjustScrollSpeed(5);
    }

    if (shortcut === 'markerPrev') {
      e.preventDefault();
      return this.gotoPrevMarker();
    }

    if (shortcut === 'markerNext') {
      e.preventDefault();
      return this.gotoNextMarker();
    }

    if (shortcut === 'toggleFullscreen') {
      e.preventDefault();
      return this.toggleFullScreen();
    }

    if (shortcut === 'skipToHome') {
      e.preventDefault();
      return this.resetScroller();
    }

    if (shortcut === 'skipToEnd') {
      e.preventDefault();
      return this.gotoEnd();
    }

    if (shortcut === 'pageUp') {
      e.preventDefault();
      return scrollController.scrollPageUp(this.props.flipVertical);
    }

    if (shortcut === 'pageDown') {
      e.preventDefault();
      return scrollController.scrollPageDown(this.props.flipVertical);
    }
  }

  adjustScrollSpeed = (amount) => {
    const currentSpeed = scrollController.getSpeed();
    const newSpeed = scrollController.adjustSpeed(amount);
    if (newSpeed !== currentSpeed && this.props.onScrollSpeedChange) {
      this.props.onScrollSpeedChange(newSpeed);
    }
  }

  scrollStart = () => {
    const opts = {
      reverse: this.props.flipVertical,
      scrollSpeed: this.props.scrollSpeed,
    }
    scrollController.start(opts, this.scrollStop);
    this.setState({
      playButtonText: 'Pause',
      hidePlay: style.hidden,
      hidePause: '',
    });
    if (this.props.autoHideFooter) {
      this._hideFooterTimer = setTimeout(() => {
        if (scrollController.isScrolling()) {
          this.setFooterVisibility(false);
        }
      }, 2500);
    }
    document.body.focus();
  }

  scrollStop = () => {
    scrollController.stop();
    this.setState({
      playButtonText: 'Play',
      hidePlay: '',
      hidePause: style.hidden,
    });
    this.setFooterVisibility(true);
  }

  setFooterVisibility(isVisible) {
    if (this._hideFooterTimer) {
      clearTimeout(this._hideFooterTimer);
      this._hideFooterTimer = null;
    }
    this._footerRef.classList.toggle(style.minimized, !isVisible);
    if (this.props.onFooterVisibleChange) {
      this.props.onFooterVisibleChange(isVisible);
    }
  }

  toggleFooterVisibility = () => {
    const isVisible = this._footerRef.classList.contains(style.minimized);
    this.setFooterVisibility(isVisible)
  }

  resetScroller = () => {
    if (scrollController.isScrolling()) {
      this.scrollStop();
    }
    scrollController.scrollToStart(this.props.flipVertical);
  }

  gotoEnd = () => {
    if (scrollController.isScrolling()) {
      this.scrollStop();
    }
    scrollController.scrollToEnd(this.props.flipVertical);
  }

  gotoPrevMarker = () => {
    scrollController.scrollToPrevMarker(this.props.flipVertical);
  }

  skipBackward = () => {
    scrollController.scrollBy(-200, this.props.flipVertical);
  }

  toggleScroller = (e) => {
    // TODO: Fix focus problem, if user clicks, then hits keyboard shortcut
    // item is fired twice, once for the keyboard, once for the focused click.
    if (e && e.x === 0 && e.y === 0) {
      return;
    }
    if (scrollController.isScrolling()) {
      this.scrollStop();
      return;
    }
    this.scrollStart();
  }

  gotoNextMarker = () => {
    scrollController.scrollToNextMarker(this.props.flipVertical);
  }

  skipForward = () => {
    scrollController.scrollBy(200, this.props.flipVertical);
  }

  toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    document.documentElement.requestFullscreen();
  }

  onClickSettings = () => {
    if (scrollController.isScrolling()) {
      this.scrollStop();
    }
    const dialog = document.querySelector('#dialogSettings');
    if (dialog) {
      dialog.showModal();
    }
  }

  render(props, state) {
    const footerClasses = `${style.footer} fixed-bottom shadow`;
    return (
      <footer class={footerClasses} ref={el => { this._footerRef = el }}>
        <div class={style.toggle}>
          <button onClick={this.toggleFooterVisibility} type="button">
            &bull;&bull;&bull;
          </button>
        </div>
        <nav class="navbar  navbar-dark bg-dark justify-content-center">
          <div class="nav">
            <div class="btn-group" role="group">
              <button onClick={this.resetScroller} type="button" class="btn btn-dark btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M12 4c-.21 0-.42.02-.62.04l1.83-1.83L11.8.8 7.59 5l4.21 4.21 1.41-1.41-1.75-1.75c.18-.02.35-.05.54-.05 3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7H3c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9z" />
                  <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" />
                </svg>
                <div>Reset</div>
              </button>
              <button onClick={this.gotoPrevMarker} type="button" class="btn btn-dark btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6zm6.5 2.14L12.97 12 16 9.86v4.28z" />
                </svg>
                <div>Previous</div>
              </button>
              <button onClick={this.skipBackward} type="button" class="btn btn-dark btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M18 9.86v4.28L14.97 12 18 9.86m-9 0v4.28L5.97 12 9 9.86M20 6l-8.5 6 8.5 6V6zm-9 0l-8.5 6 8.5 6V6z" />
                </svg>
                <div>Back</div>
              </button>
              <button onClick={this.toggleScroller} type="button" class="btn btn-dark btn-sm">
                {/* PLAY */}
                <svg class={state.hidePlay} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z" />
                </svg>
                {/* PAUSE */}
                <svg class={state.hidePause} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M19 19h-6V5h6v14zm-4-2h2V7h-2v10zm-4 2H5V5h6v14zm-4-2h2V7H7v10z" />
                </svg>
                <div>{state.playButtonText}</div>
              </button>
              <button onClick={this.skipForward} type="button" class="btn btn-dark btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M15 9.86L18.03 12 15 14.14V9.86m-9 0L9.03 12 6 14.14V9.86M13 6v12l8.5-6L13 6zM4 6v12l8.5-6L4 6z" />
                  <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" />
                </svg>
                <div>Forward</div>
              </button>
              <button id="skipForward" onClick={this.gotoNextMarker} type="button" class="btn btn-dark btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
                </svg>
                <div>Next</div>
              </button>
              {state.fullScreenAvailable &&
                <button id="fullScreen" onClick={this.toggleFullScreen} type="button" class="btn btn-dark btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                  <div>Full</div>
                </button>
              }
              <button id="settings" type="button" onClick={this.onClickSettings} class="btn btn-dark btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56c-.03.26-.06.53-.06.79s.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
                <div>Settings</div>
              </button>
            </div>
          </div>
        </nav>
      </footer>
    );
  }
}

PrompterFooter.defaultProps = DefaultSettings;

export default PrompterFooter;
