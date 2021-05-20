import { h } from 'preact';
import { Link } from 'preact-router/match';

const Landing = () => {

  document.title = 'MyPrompter';

  return (
    <div class="container">
      <h1>MyPrompter</h1>
      <h2>An easy to use teleprompter.</h2>
      <p>
        <Link href="/app" aria-label="Open MyPrompter">
          Open MyPrompter
        </Link>
      </p>
    </div>
  );
};

export default Landing;
