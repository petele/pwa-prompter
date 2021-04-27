/* eslint-disable react/self-closing-comp */
import { h, Component } from 'preact';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import style from './style.css';

class MyQuill extends Component {
  editorRef = null;
  toolbarRef = null;

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (!this.editorRef) {
      return;
    }
    const toolbarOptions = {
      container: this.toolbarRef,
      handlers: {
        image: () => {
          const position = this.editor.getSelection();
          console.log(this.editor);
          // TODO: Fix bookmark image
          this.editor.insertEmbed(position.index, 'image', '/images/delete_48dp.svg')
        },
      },
    }
    this.editor = new Quill(this.editorRef, {
      theme: 'snow',
      placeholder: 'Write your script here...',
      modules: {
        toolbar: toolbarOptions,
        history: {
          delay: 2000,
          maxStack: 250,
        },
      },
    });

    if (this.props.asQuill) {
      this.editor.setContents(this.props.asQuill);
    }
    this.editor.on('text-change', this.onTextChange);
  }

  componentWillUnmount() {
    this.editor.off('text-change', this.onTextChange);
  }

  onTextChange = () => {
    const scriptData = {
      asHTML: this.editor.root.innerHTML,
      asQuill: this.editor.getContents(),
      snippet: this.editor.getText(0, 250),
      lastUpdated: Date.now(),
    }
    if (this?.props?.onChange) {
      this.props.onChange(scriptData);
    }
  }

  shouldComponentUpdate(nextProps) {
    // console.log('here', nextProps)
    // if (nextProps.asQuill) {
    //   this.editor.setContents(nextProps.asQuill);
    // }
    return false;
  }

  render() {
    return (
      <div class={style.fullContainer}>
        <div class={style.toolbarContainer} ref={el => { this.toolbarRef = el }}>
          <span class="ql-formats">
            {/* <!-- bold/italic/underline --> */}
            <button class="ql-bold" />
            <button class="ql-italic" />
            <button class="ql-underline" />
          </span>
          <span class="ql-formats">
            {/* <!-- color --> */}
            <select class="ql-color">
              <option selected="selected"></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
              <option value="#008a00"></option>
              <option value="#0066cc"></option>
              <option value="#9933ff"></option>
              <option value="#ffffff"></option>
              <option value="#facccc"></option>
              <option value="#ffebcc"></option>
              <option value="#ffffcc"></option>
              <option value="#cce8cc"></option>
              <option value="#cce0f5"></option>
              <option value="#ebd6ff"></option>
              <option value="#bbbbbb"></option>
              <option value="#f06666"></option>
              <option value="#ffc266"></option>
              <option value="#ffff66"></option>
              <option value="#66b966"></option>
              <option value="#66a3e0"></option>
              <option value="#c285ff"></option>
              <option value="#888888"></option>
              <option value="#a10000"></option>
              <option value="#b26b00"></option>
              <option value="#b2b200"></option>
              <option value="#006100"></option>
              <option value="#0047b2"></option>
              <option value="#6b24b2"></option>
              <option value="#444444"></option>
              <option value="#5c0000"></option>
              <option value="#663d00"></option>
              <option value="#666600"></option>
              <option value="#003700"></option>
              <option value="#002966"></option>
              <option value="#3d1466"></option>
            </select>
            <select class="ql-background">
              <option selected="selected"></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
              <option value="#008a00"></option>
              <option value="#0066cc"></option>
              <option value="#9933ff"></option>
              <option value="#ffffff"></option>
              <option value="#facccc"></option>
              <option value="#ffebcc"></option>
              <option value="#ffffcc"></option>
              <option value="#cce8cc"></option>
              <option value="#cce0f5"></option>
              <option value="#ebd6ff"></option>
              <option value="#bbbbbb"></option>
              <option value="#f06666"></option>
              <option value="#ffc266"></option>
              <option value="#ffff66"></option>
              <option value="#66b966"></option>
              <option value="#66a3e0"></option>
              <option value="#c285ff"></option>
              <option value="#888888"></option>
              <option value="#a10000"></option>
              <option value="#b26b00"></option>
              <option value="#b2b200"></option>
              <option value="#006100"></option>
              <option value="#0047b2"></option>
              <option value="#6b24b2"></option>
              <option value="#444444"></option>
              <option value="#5c0000"></option>
              <option value="#663d00"></option>
              <option value="#666600"></option>
              <option value="#003700"></option>
              <option value="#002966"></option>
              <option value="#3d1466"></option>
            </select>
          </span>
          <span class="ql-formats">
            {/* <!-- alignment --> */}
            <select class="ql-align">
              <option selected></option>
              <option value="center"></option>
              <option value="right"></option>
            </select>
          </span>
          <span class="ql-formats">
            <button class="ql-image" />
          </span>
          <span class="ql-formats">
            {/* <!-- clear formatting --> */}
            <button class="ql-clean" />
          </span>
        </div>
        <div class={style.editorContainer} ref={el => { this.editorRef = el }} />
      </div>
    );
  }
}

export default MyQuill;
