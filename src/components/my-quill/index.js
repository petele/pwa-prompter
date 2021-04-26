import { h, Component } from 'preact';

import Quill from 'quill';
// import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

import { updateScript } from '../data-layer';

class MyQuill extends Component {
  editorRef = null;

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    if (!this.editorRef) {
      return;
    }
    const toolbarOptions = [
      ['bold', 'italic', 'underline'],
      [{color: []}, {background: []}],
      [{align: []}],
      ['clean']
    ];
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

    this.editor.on('text-change', () => {
      if (this.initialUpdate) {
        this.initialUpdate = false;
        return;
      }
      const scriptData = {
        asHTML: this.editor.root.innerHTML,
        asQuill: this.editor.getContents(),
        snippet: this.editor.getText(0, 250),
        lastUpdated: Date.now(),
      }
      updateScript(this.props.scriptID, scriptData);
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps?.scriptQuill) {
      this.initialUpdate = true;
      this.editor.setContents(nextProps.scriptQuill);
    }
    return false;
  }

  render() {
    return (
      <div ref={el => { this.editorRef = el }} />
    );
  }
}

export default MyQuill;
