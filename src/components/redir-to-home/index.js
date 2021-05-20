import { route } from 'preact-router';

const RedirectToHome = () => {
  route('/app', true);

  return null;
}

export default RedirectToHome;
