import { h, Component } from 'preact';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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

    if (this.props.asQuill) {
      this.editor.setContents(this.props.asQuill);
    }

    // this.editor.on('text-change', () => {
    //   const scriptData = {
    //     asHTML: this.editor.root.innerHTML,
    //     asQuill: this.editor.getContents(),
    //     snippet: this.editor.getText(0, 250),
    //     lastUpdated: Date.now(),
    //   }
    //   if (this?.props?.onChange) {
    //     this.props.onChange(scriptData);
    //   }
    // });
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
    console.log('here', nextProps)
    // if (nextProps.asQuill) {
    //   this.editor.setContents(nextProps.asQuill);
    // }
    return false;
  }

  render() {
    return (
      <div ref={el => { this.editorRef = el }} />
    );
  }
}

export default MyQuill;
