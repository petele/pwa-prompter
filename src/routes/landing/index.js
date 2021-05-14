import { h } from 'preact';
// import { Link } from 'preact-router/match';
import style from './style.css';

const Landing = () => {

  document.title = 'MyPrompter';

  return (
    <div class={style.landing}>
      <h1>MyPrompter</h1>
      <h2>An easy to use teleprompter.</h2>
      <p>
        Landing.
      </p>
    </div>
  );
};

export default Landing;
