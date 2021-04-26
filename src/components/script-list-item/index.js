import { h } from 'preact';
import style from './style.css';

import { format } from 'date-fns';

const ScriptListItem = ({ scriptID, title, snippet, lastUpdated, hasStar, onDelete, onStar }) => {

  const editorURL = `/editor/${scriptID}`;
  // const editorURL = '#';

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
  };

  return (
    <div class={style.item} href={editorURL}>
      <button class={style.delete} type="button" onClick={clickDelete}>
        <img src="/images/delete_48dp.svg" />
      </button>
      <button class={getStarButtonStyle()} type="button" onClick={clickStar}>
        <img src="/images/star_filled_48dp.svg" />
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
