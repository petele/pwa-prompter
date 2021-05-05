import { h } from 'preact';
import style from './style.css';

const NotFound = () => {

  document.title = 'Page not found - MyPrompter';

  return (
    <div class={style.notFound}>
      <h1>Sorry!</h1>
      <p>The page you were looking for wasn't found.</p>
    </div>
  );
};

export default NotFound;
