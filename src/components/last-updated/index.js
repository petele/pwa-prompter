import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import style from './style.css';

import { format, formatDistanceToNow } from 'date-fns';

const LastUpdated = ({lastUpdated}) => {
  const [ago, setAgo] = useState('');

  useEffect(() => {
    let timer = setInterval(() => {
      const prefix = 'Last edit was made';
      const now = Date.now();
      const ago = now - lastUpdated;
      let pretty;
      if (ago < 60 * 60 * 12 * 1000) {
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
