/* eslint-disable react/self-closing-comp */
import { h, Component } from 'preact';

import Quill from 'quill';
import '/style/quill.css';
import style from './style.css';

const BlockEmbed = Quill.import('blots/block/embed');
class PauseBlot extends BlockEmbed {}
PauseBlot.blotName = 'pause';
PauseBlot.tagName = 'hr';
PauseBlot.className = 'pause';
Quill.register(PauseBlot);

class BookmarkBlot extends BlockEmbed {}
BookmarkBlot.blotName = 'bookmark';
BookmarkBlot.tagName = 'hr';
BookmarkBlot.className = 'bookmark';
Quill.register(BookmarkBlot);

class MyQuill extends Component {
  editorRef = null;
  toolbarRef = null;
  containerRef = null;

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (!this.editorRef) {
      return;
    }
    this.editor = new Quill(this.editorRef, {
      theme: 'snow',
      placeholder: 'Write your script here...',
      modules: {
        toolbar: {
          container: this.toolbarRef,
        },
        history: {
          delay: 2000,
          maxStack: 250,
        },
      },
      bounds: this.containerRef,
    });

    if (this.props.asQuill) {
      this.editor.setContents(this.props.asQuill);
    }
    const butAddBookmark = this.toolbarRef.querySelector('#butBookmark');
    butAddBookmark.addEventListener('click', () => {
      this.addPrompterElement('bookmark');
    });
    const butAddPause = this.toolbarRef.querySelector('#butPause');
    butAddPause.addEventListener('click', () => {
      this.addPrompterElement('pause');
    });

    this.editor.on('text-change', this.onTextChange);
  }

  componentWillUnmount() {
    // TODO: Add check to make sure we've saved everything.
    this.editor.off('text-change', this.onTextChange);
  }

  addPrompterElement = (kind) => {
    const range = this.editor.getSelection(true);
    this.editor.insertText(range.index, '\n', Quill.sources.USER);
    this.editor.insertEmbed(range.index + 1, kind, true, Quill.sources.USER);
    this.editor.setSelection(range.index + 2, Quill.sources.SILENT);
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

  shouldComponentUpdate() {
    // console.log('here', nextProps)
    // if (nextProps.asQuill) {
    //   this.editor.setContents(nextProps.asQuill);
    // }
    return false;
  }

  render() {
    return (
      <div class={style.fullContainer} ref={el => { this.containerRef = el }}>
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
            {/* <!-- clear formatting --> */}
            <button class="ql-clean" />
          </span>
          <span class="ql-formats">
            {/* <!-- Pause/Bookmark --> */}
            <button id="butBookmark">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px" class="ql-fill">
                <rect fill="none" height="20" width="20" />
                <path d="M13.5,9v5.78l-3.5-1.4l-3.5,1.4V4.5H11V3H6.5C5.67,3,5,3.67,5,4.5V17l5-2l5,2V9H13.5z M15.75,4.25v-1.5h-1.5v1.5h-1.5v1.5 h1.5v1.5h1.5v-1.5h1.5v-1.5H15.75z" />
              </svg>
            </button>
            <button id="butPause" style="display:none;">
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" class="ql-fill">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 19h-6V5h6v14zm-4-2h2V7h-2v10zm-4 2H5V5h6v14zm-4-2h2V7H7v10z" />
              </svg>
            </button>
          </span>
        </div>
        <div class={style.editorContainer} ref={el => { this.editorRef = el }} />
      </div>
    );
  }
}

export default MyQuill;
