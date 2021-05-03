import { h, Component } from 'preact';
import { route } from 'preact-router';

// import {useEffect, useState} from "preact/hooks";
import style from './style.css';

import MyQuill from '../../components/my-quill';
import InputTitle from '../../components/input-title';
import LastUpdated from '../../components/last-updated';

class Editor extends Component {

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (this.props.scriptID.length != 21) {
      route(`/`, true);
      return;
    }
  }

  onValueChange = (newVal) => {
    if (this?.props?.onChange) {
      newVal.lastUpdated = Date.now();
      this.props.onChange(newVal);
    }
  }

  render(props) {
    return (
      <div class={style.editor}>
        <InputTitle title={props.title} onChange={this.onValueChange} />
        <MyQuill asQuill={props.asQuill} onChange={this.onValueChange} />
        <LastUpdated lastUpdated={props.lastUpdated} />
      </div>
    );
  }
}

Editor.defaultProps = {};

export default Editor;
