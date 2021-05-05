import { h } from 'preact';
import style from './style.css';

const About = () => {

  document.title = 'About - MyPrompter';

  return (
    <div class={style.about}>
      <h1>About</h1>
      <p>This is the about page.</p>
    </div>
  );
};

export default About;
