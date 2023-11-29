  import React, { useState } from 'react';
  import { EditorState, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
  import { Editor } from 'react-draft-wysiwyg';
  import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
  import './App.css';

  const initData = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        key: "xxxxx",
        text: "ここだよ！",
        type: "unstyled",
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        data: {},
      },
    ],
  })

  const initState = EditorState.createWithContent(
    initData,
  )

  function App() {
    const [editorState, setEditorState] = useState(
      initState
    );

    const myKeyBinding = (e) => {
      if (e.key === "Enter") {
        alert("Enter")
        return "disabled"
      }
      return getDefaultKeyBinding(e)
    }

    return (
      <div className="App">
        <header className="App-header">
          Rich Text Editor
        </header>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          // readOnly={true}
          myKeyBinding={myKeyBinding}
        />
      </div>
    )
  }

  export default App;
