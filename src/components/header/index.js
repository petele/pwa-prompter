import { Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.css';

import ProgressBar from '../progress-bar';

class Header extends Component {

  shouldComponentUpdate(nextProps) {
    const scriptID = nextProps.scriptID;
    const selectedRoute = nextProps.selectedRoute;

    this.isHome = selectedRoute === '/';
    this.isAbout = selectedRoute === '/about';
    this.isEditor = selectedRoute.startsWith('/editor/');
    this.isPrompter = selectedRoute.startsWith('/prompter/');

    this.editorURL = `/editor/${scriptID}`;
    this.prompterURL = `/prompter/${scriptID}`;

    this.homeClassName = this.isHome ? style.active : '';
    if (this.isHome || this.isAbout) {
      this.editorClassName = style.hidden;
      this.prompterClassName = style.hidden;
      return true;
    }
    this.editorClassName = this.isEditor ? style.active : '';
    this.prompterClassName = this.isPrompter ? style.active : '';
    return true;
  }

  render() {
    return (
      <header class={style.header}>
        <nav>
          <Link className={this.homeClassName} href="/">Home</Link>
        </nav>
        <h1>
          MyPrompter
        </h1>
        <nav>
          <Link className={this.editorClassName} href={this.editorURL}>
            Edit
          </Link>
          <Link className={this.prompterClassName} href={this.prompterURL}>
            Prompt
          </Link>
          <Link className={style.login} href="/login">
            Login
          </Link>
        </nav>
        {
          this.isPrompter &&
          <ProgressBar selectedRoute={this.props.selectedRoute} />
        }
      </header>
    );
  }
}

export default Header;
