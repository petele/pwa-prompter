/* eslint-disable react/self-closing-comp */
import { h, Component } from 'preact';

import Quill from 'quill';
import '/style/quill.css';
import style from './style.css';
const Delta = Quill.import('delta');
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
  saveInterval = null;

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

    this.editor.disable();

    // Paste handler for links
    // - Removes links, only inserts the text.
    this.editor.clipboard.addMatcher('A', (node, delta) => {
      const text = delta.ops[0]?.insert;
      return new Delta().insert(text);
    });

    // Paste handler for images
    // - Removes images completely.
    this.editor.clipboard.addMatcher('IMG', () => {
      return new Delta();
    });

    // Paste handler for HTML
    // - Removes color from black text on black/transparent background.
    // - Removes background color if it's black, or transparent.
    this.editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      delta.ops.forEach((op) => {
        const color = op.attributes?.color;
        const bgColor = op.attributes?.background;

        // Is the background black, or transparent?
        const removeBg = (bgColor === '#000000' || bgColor === 'transparent');
        // Is the color black on a black/transparent background?
        const removeColor = (color === '#000000' && removeBg);

        if (removeBg) {
          delete op.attributes.background;
        }
        if (removeColor) {
          delete op.attributes.color;
        }
      });
      return delta;
    });

    const butSave = this.toolbarRef.querySelector('#butSave');
    butSave.addEventListener('click', () => {
      this.saveIntervalTick(true);
    });
    const butAddBookmark = this.toolbarRef.querySelector('#butBookmark');
    butAddBookmark.addEventListener('click', () => {
      this.addPrompterElement('bookmark');
    });
    const butAddPause = this.toolbarRef.querySelector('#butPause');
    butAddPause.addEventListener('click', () => {
      this.addPrompterElement('pause');
    });
    const butUndo = this.toolbarRef.querySelector('#butUndo');
    butUndo.addEventListener('click', () => {
      this.editor.history.undo();
    });
    const butRedo = this.toolbarRef.querySelector('#butRedo');
    butRedo.addEventListener('click', () => {
      this.editor.history.redo();
    });

    this.quillDelta = new Delta();
    this.saveInterval = setInterval(this.saveIntervalTick, 2500);
    this.editor.on('text-change', this.onTextChange);
    this.containerRef.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    this.editor.off('text-change', this.onTextChange);
    this.containerRef.removeEventListener('keydown', this.onKeyDown);
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.saveIntervalTick();
  }

  addPrompterElement = (kind) => {
    const range = this.editor.getSelection(true);
    this.editor.insertText(range.index, '\n', Quill.sources.USER);
    this.editor.insertEmbed(range.index + 1, kind, true, Quill.sources.USER);
    this.editor.setSelection(range.index + 2, Quill.sources.SILENT);
  }

  onKeyDown = (e) => {
    // console.log('keydown [quill]', e, e.code, e.ctrlKey, e.metaKey, e.shiftKey, e.key);
    const keyCode = e.code;

    if ((e.metaKey || e.ctrlKey) && keyCode === 'KeyY') {
      e.preventDefault();
      this.editor.history.redo();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && keyCode === 'KeyS') {
      e.preventDefault();
      this.saveIntervalTick(true);
      return;
    }
  }

  onTextChange = (change) => {
    this.quillDelta = this.quillDelta.compose(change);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.asQuill) {
      // Quill already set.
      return false;
    }
    if (!nextProps.asQuill) {
      // No value for Quill, quit.
      return false;
    }
    this.editor.setContents(nextProps.asQuill, Quill.sources.SILENT);
    this.editor.history.clear();
    this.quillDelta = new Delta();
    const elemEdit = document.querySelector('.ql-editor');
    elemEdit.setAttribute('tabindex', 2);
    if (!nextProps.readOnly) {
      this.editor.enable();
    }
    return false;
  }

  saveIntervalTick = (force) => {
    if (!force && this.quillDelta.length() === 0) {
      return;
    }
    const scriptData = {
      asHTML: this.editor.root.innerHTML,
      asQuill: this.editor.getContents(),
      snippet: this.editor.getText(0, 250),
    }
    this.quillDelta = new Delta();
    if (this?.props?.onChange) {
      this.props.onChange(scriptData);
    }
  }

  render() {
    return (
      <div class={style.fullContainer} ref={el => { this.containerRef = el }}>
        <div class={style.toolbarContainer} ref={el => { this.toolbarRef = el }}>
          <span class="ql-formats">
            {/* <!-- bold/italic/underline --> */}
            <button class="ql-bold" tabindex="3" aria-label="bold" />
            <button class="ql-italic" tabindex="3" aria-label="italic" />
            <button class="ql-underline" tabindex="3" aria-label="underline" />
          </span>
          <span class="ql-formats">
            {/* <!-- color --> */}
            <select class="ql-color" tabindex="3" aria-label="color">
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
            <select class="ql-background" tabindex="3" aria-label="background color">
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
            <select class="ql-align" tabindex="3" aria-label="alignment">
              <option selected></option>
              <option value="center"></option>
              <option value="right"></option>
            </select>
          </span>
          <span class="ql-formats" tabindex="3">
            {/* <!-- clear formatting --> */}
            <button class="ql-clean" title="Clear formatting" aria-label="clear formatting" />
          </span>
          <span class="ql-formats">
            {/* <!-- Pause/Bookmark --> */}
            <button id="butBookmark" tabindex="3" title="Add bookmark" aria-label="add bookmark">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="18px" viewBox="0 0 20 20" width="18px" class="ql-fill">
                <rect fill="none" height="20" width="20" />
                <path d="M13.5,9v5.78l-3.5-1.4l-3.5,1.4V4.5H11V3H6.5C5.67,3,5,3.67,5,4.5V17l5-2l5,2V9H13.5z M15.75,4.25v-1.5h-1.5v1.5h-1.5v1.5 h1.5v1.5h1.5v-1.5h1.5v-1.5H15.75z" />
              </svg>
            </button>
            <button id="butPause" style="display:none;" tabindex="-1">
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" class="ql-fill">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 19h-6V5h6v14zm-4-2h2V7h-2v10zm-4 2H5V5h6v14zm-4-2h2V7H7v10z" />
              </svg>
            </button>
          </span>
          <span class="ql-formats">
            {/* Save */}
            <button id="butSave" tabindex="3" aria-label="save">
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" class="ql-fill">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19z" />
                <circle cx="12" cy="15" r="3" />
                <path d="M6 6h9v4H6z" />
              </svg>
            </button>
          </span>
          <span class="ql-formats">
            {/* <!-- undo/redo --> */}
            <button id="butUndo" tabindex="3" aria-label="undo" title="Undo">
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" class="ql-fill">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M14.1 8H7.83l2.59-2.59L9 4 4 9l5 5 1.41-1.41L7.83 10h6.27c2.15 0 3.9 1.57 3.9 3.5S16.25 17 14.1 17H7v2h7.1c3.25 0 5.9-2.47 5.9-5.5S17.35 8 14.1 8z" />
              </svg>
            </button>
            <button id="butRedo" tabindex="3" aria-label="redo" title="Redo">
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" class="ql-fill">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M6 13.5C6 11.57 7.75 10 9.9 10h6.27l-2.59 2.59L15 14l5-5-5-5-1.41 1.41L16.17 8H9.9C6.65 8 4 10.47 4 13.5S6.65 19 9.9 19H17v-2H9.9C7.75 17 6 15.43 6 13.5z" />
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
