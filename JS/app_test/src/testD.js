import { useState, useEffect } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createInlineToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/inline-toolbar';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
} from '@draft-js-plugins/buttons';

const text =
  'In this editor a toolbar shows up once you select part of the text …';

const MyEditor = () => {
  const [plugins, InlineToolbar] = useMemo(() => {
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
  }, []);

  const [editorState, setEditorState] = useState(() =>
    createEditorStateWithText('')
  );

  useEffect(() => {
    setEditorState(createEditorStateWithText(text));
  }, []);

  const onChange = (value) => {
    setEditorState(value);
  };

  return (
    <div>
      <Editor 
        editorState={editorState} 
        onChange={onChange} 
        plugins={plugins} 
      />
      <InlineToolbar>
        {(externalProps) => (
          <>
            <ItalicButton {...externalProps} />
            <BoldButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <Separator {...externalProps} />
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <HeadlineThreeButton {...externalProps} />
          </>
        )}
      </InlineToolbar>
    </div>
  );
};

export default MyEditor;