import { h, Component } from 'preact';
import { route } from 'preact-router';

// import {useEffect, useState} from "preact/hooks";
import style from './style.css';

import { getScript } from '../../components/data-layer';

import MyQuill from '../../components/my-quill';
import InputTitle from '../../components/input-title';

// Note: `scriptID` comes from the URL, courtesy of our router
class Editor extends Component {

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (this.props.scriptID.length != 21) {
      route(`/`, true);
      return;
    }

    getScript(this.props.scriptID).then((scriptObj) => {
      this.setState(scriptObj);
      document.title = scriptObj.title;
    });
  }

  render(props, state) {
    return (
      <div class={style.editor}>
        <InputTitle scriptID={props.scriptID} title={state.title} />
        <div class={style.quill}>
          <MyQuill scriptID={props.scriptID} scriptQuill={state.asQuill} />
        </div>
      </div>
    );
  }
}

Editor.defaultProps = {};

export default Editor;
