import { route } from 'preact-router';

const RedirectToHome = () => {
  route('/', true);

  return null;
}

export default RedirectToHome;
