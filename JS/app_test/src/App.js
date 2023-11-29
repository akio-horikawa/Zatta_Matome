import React, { useState } from 'react';
import { EditorState, convertFromRaw, getDefaultKeyBinding, Modifier, SelectionState } from 'draft-js';
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
   {
    key: "deleteMe",
    text: "すぐにけせ",
    type: "header-one",
    depth: 0,
    entityRanges: [],
    inlineStyleRanges: [],
    data: {},
   },
 ],
});

function removeBlockKey(editorState, blockKey){
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(blockKey);
  const blockRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength(),
  });
  const newContentState = Modifier.removeRange(contentState, blockRange, 'backward');
  const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');

  return newEditorState;
}

const initState = EditorState.createWithContent(
 initData,
);

function App() {
 const [editorState, setEditorState] = useState(
   initState
 );

 const keyBindingFn = (e) => {
   if (e.key === "Enter") {
     alert("アップルパイ！")
     return "disabled"
   }
   if (e.key === "Backspace") {
     alert("油揚げ！")
     const newEditorState = removeBlockKey(editorState, "deleteMe");
    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
      return "handled";
    }
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
       keyBindingFn={keyBindingFn}
     />
   </div>
 )
}

export default App;