import { h } from 'preact';
import style from './style.css';

import { format } from 'date-fns';

const ScriptListItem = ({ scriptID, title, snippet, lastUpdated, hasStar, onDelete, onStar }) => {

  const editorURL = `/editor/${scriptID}`;

  const formatDate = (lastUpdated) => {
    if (lastUpdated) {
      return format(lastUpdated, `PPP 'at' h:mm aaa`);
    }
    return '';
  }

  const clickDelete = () => {
    if (onDelete) {
      onDelete(scriptID);
    }
  }

  const clickStar = () => {
    if (onStar) {
      onStar(scriptID, !hasStar);
    }
  }

  const getStarButtonStyle = () => {
    const base = style.star;
    if (hasStar) {
      return `${base} ${style.hasStar}`;
    }
    return base;
  }

  const getStarStyle = (kind) => {
    if (hasStar && kind === 'outline') {
      return style.hidden;
    }
    if (!hasStar && kind === 'filled') {
      return style.hidden;
    }
    return '';
  };

  return (
    <div class={style.item} href={editorURL}>
      <button class={style.delete} type="button" aria-label="delete" onClick={clickDelete}>
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#FFFFFF">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9zm4 0h2v9h-2z" />
        </svg>
      </button>
      <button class={getStarButtonStyle()} type="button" aria-label="delete" onClick={clickStar}>
        {/* Outline */}
        <svg class={getStarStyle('outline')} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
        </svg>
        {/* Filled */}
        <svg class={getStarStyle('filled')} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#ffffff">
          <path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
        </svg>
      </button>
      <a href={editorURL}>
        <div class={style.title}>{title}</div>
        <div class={style.snippet}>{snippet}...</div>
        <div class={style.lastUpdated}>
          <b>Updated:</b> {formatDate(lastUpdated)}
        </div>
      </a>
    </div>
  );
}

export default ScriptListItem;
