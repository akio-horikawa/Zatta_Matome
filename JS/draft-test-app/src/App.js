import React, { useEffect, useState } from 'react';
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

const initState = EditorState.createWithContent(
 initData,
);

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

//  const ReadOnlyBlock = ({ block, blockProps }) => {
//   const { readOnly } = blockProps;
//   return (
//    <div contentEditable={!readOnly}>
//      {block.getText()}
//    </div>
//   );
//  }

//  const myBlockRenderer = (block) => {
//   if (block.getType() === "unstyled") {
//    return {
//      component: ReadOnlyBlock,
//      props: {
//        readOnly: true,
//      },
//    }
//   }
//   return null
//  }
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const blockKey = 'xxxxx';
    const blockSelection = selectionState.merge({
      anchorKey: blockKey,
      focusKey: blockKey,
    });

    const newContentState = Modifier.setBlockData(
      contentState,
      blockSelection,
      { link: 'https://www.google.co.jp/'}
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-block-data'
    );

    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
    }
  },[editorState]);

 const LinkBlock = ({ block, blockProps }) => {
  const { readOnly } = blockProps;
  const link = block.getData().get('link');
  return (
   <div contentEditable={!readOnly}>
     <a href={link} onClick={() => {
      window.location.href= link;
    }}>
      {block.getText()}
     </a>
   </div>
  );
 }

 const myBlockRenderer = (block) => {
  if (block.getType() === "unstyled") {
   return {
     component: LinkBlock,
     props: {
       readOnly: true,
     },
   }
  }
  return null
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
      blockRendererFn={myBlockRenderer}
      localization={{
        locale: "ja",
      }}
    />
  </div>


 )
}

export default App;