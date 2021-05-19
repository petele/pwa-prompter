import { h } from 'preact';

const NotFound = () => {

  document.title = 'Page not found - MyPrompter';

  return (
    <div class="container">
      <h1>Sorry!</h1>
      <p>The page you were looking for wasn't found.</p>
    </div>
  );
};

export default NotFound;
