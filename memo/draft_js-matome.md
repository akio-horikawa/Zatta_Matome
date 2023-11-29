# Draft.js_メモ

---

Draft.jsとは、React（JavaScriptのライブラリ）上で、リッチテキストドキュメントを構成するためのライブラリ。世界的には人気だったらしいが、現在はアーカイブ化され、また日本語の情報が少ない。

恩恵として、ブラウザ間の挙動の差を吸収、エディタ全体を一つのStateで管理可、DOM（Document Object Model）をStateで持つためJavaScriptオブジェクトで管理可ということがあるらしい。情報がなさすぎて知ったことではないと言いたい。

---

初期（React自体よく理解できていないので全て手探り状態）
```

  import React, { useState } from 'react';
  import { EditorState } from 'draft-js';
  import { Editor } from 'react-draft-wysiwyg';
  import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
  import './App.css';

  function App() {
    const [editorState, setEditorState] = useState(
      () => EditorState.createEmpty(),
    );

    return (
      <div className="App">
        <header className="App-header">
          Rich Text Editor
        </header>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
        />
      </div>
    )
  }

  export default App;

```

localでの起動は `npm start` をターミナルに入力。

先頭から、ReactとDraft.jsのインポートはとりあえず良し。cssに関しては、 `create-react-app` のデフォルト状態に以下コードを足しただけ。
```
.App-header {
  background-color: #282c34;
  min-height: 5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  margin-bottom: 5vh;
  text-align: center;
  padding: 12px;
}
```
なんだか見覚えのあるよくある入力欄になっている気がする。これを元に色々と要素を足す等してDraft.jsの仕様を知る必要がある。

---

`function EditorApp()` 内の `const [editorState, setEditorState]` の役割がよくわからない。
→ `usestate` はReactにおけるフックの一種でコンポーネント内で状態を管理するもの。状態を保存し、更新することができる。今回で言えば、 `editorState` `setEditorState` を状態の保存、更新用の変数、関数として、 `useState(() => EditorState.createEmpty())` でエディタの初期状態をとっている。 `EditorState.createEmpty()` はエディタの状態をとる、 `editState` を生成するもの。

基本的にエディタの設定は `return` 内の `<Editor />` に記述している。
恐らく、以下のコードは必須のようだ。
```
editorState={editorState}
onEditorStateChange={setEditorState}
```
上のコードは当然のように `<Editor />` の中に記述されており、ユーザによる入力の処理に関連すると考えられる。

`editorState = {editorState}` に関しては、 まず `editorState` はエディタの状態を表し、この場所では現在のエディタの状態を保存している。

`onEditorStateChange = {setEditorState}` エディタの状態が変更されたときに関数を呼び出すプロパティ。変更されたエディタの状態を `editorState` にセットする。

`onEditorStateChange = {setEditorState}` と `onChange = {setEditorState}` の違いは、エディタの状態を直接取得できるか否か。前者はエディタの状態が変化した時に呼び出されるため、状態を直接取得している。それに対して、後者は通常、Reactのイベントハンドラとして使用されていることもあり、イベントオブジェクトを引数として取得するので直接エディタの状態を受け取っているわけではない。


---

#### 初期値と読み取り専用化

エディタに初期値を与えるには以下コード。
```
  const initData = convertFromRaw({ // 生のオブジェクトからContentStateへ変換
    entityMap: {}, // 名前そのまま、メタデータを保存してデータを定義
    blocks: [ // エディタの内容
      {
        key: "xxxxx", // unique key, 識別用
        text: "ここだよ！", // 表示するテキスト
        type: "unstyled", // text type, 初期値が "unstyled", "header-one" 等で見出し等設定できる
        depth: 0, // 深度, 入れ子の中身でどこにいるか
        entityRanges: [], // ブロック内でのエンティティの範囲, ブロック内の特定のテキストが何のエンティティに属するか
        inlineStyleRanges: [], // ブロック内でのインラインスタイルの範囲, ブロック内の特定のテキストが何のスタイルに属するか
        data: {}, // ブロックに関連付けられたカスタムデータ, ブロックのプロパティ、メタデータを保存する
      },
    ],
  })

  const initState = EditorState.createWithContent( // ContentStateからEditorStateへ変換する
    initData,
  )

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
          readOnly={true}
        />
      </div>
    )
  }
```

入力欄の微妙な位置に `"ここだよ！"` が表示されているはず。

#### キーバインド

特定のキーが押された時の動作を設定できる。Draft.jsの機能では、同時に複数のキーを押した情報を一度に取得することはできない。
以下コード。
```
 const keyBindingFn = (e) => {
   if (e.key === "Enter") {
     alert("アップルパイ！")
     return "disabled"
   }
   return getDefaultKeyBinding(e)
 }

 /*
 *  <Editor
 *      /..
 *      keyBindingFn={myKeyBindingFn}
 *      /..
 *  />
 */
```
上のコードの部分が動作すると `Enter` を押したときに `alert` で `"アップルパイ！"` と表示される。あくまで、入力欄上で `Enter` を押したときのみ動作し、また `shift` `ctrl` 等と同時に押すと回避できる。

キーバインドの設定部分で `return "disabled"` しているのは設定したキーを押したときのデフォルトの動きを無効化しているため。尚、他のプラグインの動作なども無効化するため注意。
他にも `return "bold"` で文字列の太字化等がある。

---

#### 任意のブロックの削除

Draft.jsはデフォルトで `BackSpace` でブロックを削除できる。（？）
→ 要するに初期値などで追加した文字列や、 `h1` だったりと設定したもの、画像等を `BackSpace` で消せるということ。

以下、色々試した上で成功したコード。（全文）
```
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
     removeBlockKey(editorState, "deleteMe");
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
```
上は、 `deleteMe` というキーを設定している *`"すぐにけせ"`* という表示を `Backspace` を押したときに消したい、というコード。キモになりそうなところを下記抜粋。
```
// deleteMeキーのブロックは省略

const keyBindingFn = (e) => {

    // アップルパイは省略

   if (e.key === "Backspace") {
     alert("油揚げ！")
     const newEditorState = removeBlockKey(editorState, "deleteMe"); // ブロック削除の関数呼び出し
    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
      return "handled";
    } // removeBlockKey関数が新しい EditorState を返す時に return "handled" を返すようにする必要があった
   }
   return getDefaultKeyBinding(e)
 }
```
以下、ブロック削除の部分（後日我詳細追記予定）
```
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
```