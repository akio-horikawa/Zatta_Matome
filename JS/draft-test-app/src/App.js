import React, { useState } from 'react';
import { EditorState, convertFromRaw, getDefaultKeyBinding, Modifier, SelectionState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './App.css';

const initData = convertFromRaw({
 entityMap: {},
 blocks: [
   {
     key: "apple",
     text: "Apple pie!",
     type: "unstyled",
     depth: 0,
     entityRanges: [],
     inlineStyleRanges: [],
     data: {},
   },
 ],
});

const initState = EditorState.createWithContent(
 initData,
);

function App() {
 const [editorState, setEditorState] = useState(
   initState
 );

 return (
  <div className="App">
    <header className="App-header">
      Rich Text Editor
    </header>
    <Editor
      editorState={editorState}
      onEditorStateChange={setEditorState}
      localization={{
        locale: "ja",
      }}
    />
  </div>


 );
}

export default App;