import { Component } from 'preact';
import { route } from 'preact-router';

class RedirectToHome extends Component {
  componentWillMount() {
    route('/', true);
  }

  render() {
    return null;
  }
}

export default RedirectToHome;
