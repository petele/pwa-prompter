
const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 76;

let _raf;
let _callback;
let _reverse = false;
let _scrollSpeed = 175;
let _scrollSpeedPercent = 175;


export function start(opts, callback) {
  if (_raf) {
    return false;
  }
  _callback = callback;
  _reverse = !!opts.reverse;
  _scrollSpeed = opts.scrollSpeed || 175;
  _scrollSpeedPercent = _scrollSpeed / 100;
  doScrollStep();
  return true;
}

export function stop() {
  cancelAnimationFrame(_raf);
  _raf = null;
  _callback = null;
}

export async function scrollBy(val, reverse) {
  const isScrolling = !!_raf;
  if (isScrolling) {
    cancelAnimationFrame(_raf);
  }
  const direction = reverse ? -1 : 1;
  window.scrollBy({top: val * direction, behavior: 'smooth'});
  await waitWhileScrolling();
  if (isScrolling) {
    doScrollStep();
  }
}

export async function scrollPageUp(reverse) {
  const height = getWindowHeight() - HEADER_HEIGHT - FOOTER_HEIGHT;
  return scrollBy(height * -1, reverse);
}

export async function scrollPageDown(reverse) {
  const height = getWindowHeight() - HEADER_HEIGHT - FOOTER_HEIGHT;
  return scrollBy(height, reverse);
}

export async function scrollToElement(elem) {
  const isScrolling = !!_raf;
  if (isScrolling) {
    cancelAnimationFrame(_raf);
  }
  const elemTop = elem.offsetTop;
  window.scrollTo({top: elemTop, behavior: 'smooth'});
  await waitWhileScrolling();
  if (isScrolling) {
    doScrollStep();
  }
}

export function scrollToStart(reverse) {
  const pos = reverse ? getDocHeight() : 0;
  window.scrollTo({top: pos, behavior: 'smooth'});
}

export function scrollToEnd(reverse) {
  const pos = reverse ? 0 : getDocHeight();
  window.scrollTo({top: pos, behavior: 'smooth'});
}

export function scrollToNextMarker(reverse) {
  if (reverse) {
    console.log('TODO: NYI scrollToNextMarker (reverse)');
    return;
  }
  const currentY = getCurrentPosition() + HEADER_HEIGHT;
  const markers = document.querySelectorAll('#pwapContent hr.bookmark');
  for (const marker of markers) {
    if (marker.offsetTop > currentY) {
      scrollToElement(marker);
      break;
    }
  }
}

export function scrollToPrevMarker(reverse) {
  if (reverse) {
    console.log('TODO: NYI scrollToPrevMarker (reverse)');
    return;
  }
  const currentY = getCurrentPosition();
  const markers = document.querySelectorAll('#pwapContent hr.bookmark');
  const len = markers.length;
  // eslint-disable-next-line for-direction
  for (let i = len - 1; i >= 0; i--) {
    const marker = markers[i];
    if (currentY > marker.offsetTop) {
      scrollToElement(marker);
      break;
    }
  }
}

export function isScrolling() {
  return !!_raf;
}

export function getSpeed() {
  return _scrollSpeed;
}

export function getCurrentPosition() {
  return window.scrollY;
}

export function getWindowHeight() {
  return window.innerHeight;
}

export function getDocHeight() {
  return document.body.scrollHeight;
}

export function setSpeed(speed) {
  speed = parseInt(speed, 10);
  _scrollSpeed = speed;
  _scrollSpeedPercent = speed / 100;
  return speed;
}

export function adjustSpeed(amount) {
  amount = parseInt(amount, 10);
  let newSpeed = _scrollSpeed + amount;
  if (newSpeed <= 0) {
    newSpeed = 1;
  }
  if (newSpeed > 500) {
    newSpeed = 500;
  }
  _scrollSpeed = newSpeed;
  _scrollSpeedPercent = newSpeed / 100;
  return newSpeed;
}

function doScrollStep(lastScrollAmount = 0) {
  const currentY = getCurrentPosition();
  const scrollSpeed = _scrollSpeedPercent;

  const direction = _reverse ? -1 : 1;
  const scrollAmount = scrollSpeed + lastScrollAmount;
  const scrollBy = Math.floor(scrollAmount);

  let scrollRemainder = scrollAmount;
  if (scrollBy >= 1) {
    window.scrollBy({top: scrollBy * direction});
    scrollRemainder -= scrollBy;
  }

  if (_reverse && currentY === 0) {
    onScrollEnd();
    return;
  }

  if (!_reverse && currentY + window.innerHeight >= getDocHeight()) {
    onScrollEnd();
    return;
  }

  _raf = window.requestAnimationFrame(() => {
    doScrollStep(scrollRemainder);
  });
}

function onScrollEnd() {
  cancelAnimationFrame(_raf);
  _raf = null;
  if (_callback) {
    _callback();
  }
  _callback = null;
}

function waitWhileScrolling(prevY) {
  const currentY = getCurrentPosition();
  if (currentY === prevY) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, 50);
  }).then(() => {
    return waitWhileScrolling(currentY);
  });
}
