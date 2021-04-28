import { h, Component } from 'preact';
import { route } from 'preact-router';

// import {useEffect, useState} from "preact/hooks";
import style from './style.css';

import { format, formatDistanceToNow } from 'date-fns';
import MyQuill from '../../components/my-quill';
import InputTitle from '../../components/input-title';

class Editor extends Component {

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (this.props.scriptID.length != 21) {
      route(`/`, true);
      return;
    }
    this.updateLastUpdated();
    this.lastSavedInterval = setInterval(() => {
      this.updateLastUpdated();
    }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.lastSavedInterval);
  }

  updateLastUpdated = () => {
    const now = Date.now();
    const lastUpdated = this.props.lastUpdated;
    const ago = now - lastUpdated;
    if (ago < 60 * 60 * 24 * 30 * 1000) {
      const pretty = formatDistanceToNow(lastUpdated, { addSuffix: true });
      this.setState({lastUpdated: pretty});
      return;
    }
    const pretty = format(lastUpdated, `PPP 'at' h:mm aaa`);
    this.setState({lastUpdated: pretty});
  }

  onValueChange = (newVal) => {
    if (this?.props?.onChange) {
      this.props.onChange(newVal);
    }
  }

  render(props) {
    return (
      <div class={style.editor}>
        <InputTitle title={props.title} onChange={this.onValueChange} />
        <MyQuill asQuill={props.asQuill} onChange={this.onValueChange} />
        <div class={style.lastSaved}>
          <b>Last saved:</b> {this.state.lastUpdated}
        </div>
      </div>
    );
  }
}

Editor.defaultProps = {};

export default Editor;
