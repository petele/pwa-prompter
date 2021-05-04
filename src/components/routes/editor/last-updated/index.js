import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import style from './style.css';

import { format, formatDistanceToNow } from 'date-fns';

const VERY_RECENT = 15 * 1000;
const RECENT = 60 * 60 * 24 * 1000;

const LastUpdated = ({lastUpdated}) => {
  const [ago, setAgo] = useState('');

  useEffect(() => {
    let timer = setInterval(() => {
      const prefix = 'Last edit was made';
      const now = Date.now();
      const ago = now - lastUpdated;
      let pretty;
      if (ago < VERY_RECENT) {
        pretty = 'just now'
      } else if (ago < RECENT) {
        const opts = { addSuffix: true, includeSeconds: true };
        pretty = formatDistanceToNow(lastUpdated, opts);
      } else {
        pretty = format(lastUpdated, `PPP 'at' h:mm aaa`);
      }
      setAgo(`${prefix} ${pretty}`);
    }, 500);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  return (
    <div class={style.lastSaved}>
      {ago}
    </div>
  );
}

export default LastUpdated;
