# Draft.js_メモ

---

Draft.jsとは、React（JavaScriptのライブラリ）上で、リッチテキストドキュメントを構成するためのライブラリ。世界的には人気だったらしいが、現在はアーカイブ化され、また日本語の情報が少ない。

恩恵として、ブラウザ間の挙動の差を吸収、エディタ全体を一つのStateで管理可、DOM（Document Object Model）をStateで持つためJavaScriptオブジェクトで管理可ということがあるらしい。情報がなさすぎて知ったことではないと言いたい。

最新のコードは `Zatta_Matome/JS/draft-test-app/src/App.js`に。

---

# 目次 <a id=index></a>

[初期値のやつ](#init)  
[キーバインド](#keybind)  
[ブロック削除](#blockdelete)  
[レンダリング](#rendering)  
[レンダリング応用](#rendering_ex)  
[draft-js-plugins](#djp)

---

初期（React自体よく理解できていないので全て手探り状態）
```js

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

draft.jsライブラリは `npm install draft-js` でインスコする。（追記）

localでの起動は `npm start` をターミナルに入力。

先頭から、ReactとDraft.jsのインポートはとりあえず良し。cssに関しては、 `create-react-app` のデフォルト状態に以下コードを足しただけ。
```css
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
```js
editorState={editorState}
onEditorStateChange={setEditorState}
```
上のコードは当然のように `<Editor />` の中に記述されており、ユーザによる入力の処理に関連すると考えられる。

`editorState = {editorState}` に関しては、 まず `editorState` はエディタの状態を表し、この場所では現在のエディタの状態を保存している。

`onEditorStateChange = {setEditorState}` エディタの状態が変更されたときに関数を呼び出すプロパティ。変更されたエディタの状態を `editorState` にセットする。

`onEditorStateChange = {setEditorState}` と `onChange = {setEditorState}` の違いは、エディタの状態を直接取得できるか否か。前者はエディタの状態が変化した時に呼び出されるため、状態を直接取得している。それに対して、後者は通常、Reactのイベントハンドラとして使用されていることもあり、イベントオブジェクトを引数として取得するので直接エディタの状態を受け取っているわけではない。


---

[目次](#index)
#### 初期値と読み取り専用化 <a id=init></a>

エディタに初期値を与えるには以下コード。
```js
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

---

[目次](#index)
#### キーバインド <a id=keybind></a>

特定のキーが押された時の動作を設定できる。Draft.jsの機能では、同時に複数のキーを押した情報を一度に取得することはできない。
以下コード。
```js
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

[目次](#index)
#### 任意のブロックの削除 <a id=blockdelete></a>

Draft.jsはデフォルトで `BackSpace` でブロックを削除できる。（？）
→ 要するに初期値などで追加した文字列や、 `h1` だったりと設定したもの、画像等を `BackSpace` で消せるということ。

以下、色々試した上で成功したコード。（全文）
```js
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
```js
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
```js
function removeBlockKey(editorState, blockKey){
  const contentState = editorState.getCurrentContent(); // 現在のエディタの状態を取得、保存
  const block = contentState.getBlockForKey(blockKey); // 呼び出しで指定したキーでブロックを取得する 
  const blockRange = new SelectionState({
    anchorKey: blockKey, // ブロックの開始位置
    anchorOffset: 0, // ブロックの開始位置
    focusKey: blockKey, // ブロックの終了位置
    focusOffset: block.getLength(), // ブロックの終了位置
  });　// new SelectStateでブロックの範囲を定義
  const newContentState = Modifier.removeRange(contentState, blockRange, 'backward'); // 指定したブロックの範囲からコンテンツを削除する
  const newEditorState = EditorState.push(editorState, newContentState, 'remove-range'); // 上のコードで返ってきた新しいContentStateをエディタに送る

  return newEditorState;
}
```
上のブロック削除のコードは参考にしていたサイトの `remove` では動いてくれなかったので、 `Modifier.removeRange` のほうで削除を実行している。調べた限りでは `Modifier`  はDraft.jsのブロック削除用のメソッドらしい。

---

[目次](#index)
#### 特殊なブロックのレンダリング <a id=rendering></a>

Draft.jsの標準時でのブロックのタイプは以下。
```js
type CoreDraftBlockType =
  | 'unstyled'
  | 'paragraph"
  | 'header-one'
  | 'header-two'
  | 'header-three'
  | 'header-four'
  | 'header-five'
  | 'header-six'
  | 'unordered-list-item'
  | 'ordered-list-item'
  | 'blockquote'
  | 'code-block'
  | 'atomic';
```
参考サイトのコードはそのままでは動かなかったので、以下になんとか動作したコード。
```js
 const ReadOnlyBlock = ({ block, blockProps }) => { // ReadOnlyBlockを定義し、blockとblockPropsを受け取る
  const { readOnly } = blockProps; // blockPropsからreadOnlyを取り出す
  return (
   <div contentEditable={!readOnly}> // readOnlyプロパティの値に基づき、contentEditableの属性を設定する
     {block.getText()} // ブロック内のテキストを取得
   </div>
  );
 }

 const myBlockRenderer = (block) => { // myBlockRendererを定義し、blockを受け取る
  if (block.getType() === "unstyled") { // 受け取ったblockが"unstyled"かチェック
   return {
     component: ReadOnlyBlock, // "unstyled"であればReadOnlyBlockを返す
     props: {
       readOnly: true, // readOnlyをtrueに
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
       blockRendererFn={myBlockRenderer} // 追加：blockRendererFn => 特定のブロックタイプへのカスタムレンダリングを定義
     />
   </div>
 )
```
レンダリングを設定しておくことで、ユーザの入力した特定のタイプのテキストをこちらの指定した形や設定に変更できる。ちょっと何言ってるかわからないが、雰囲気的に便利に聞こえる。

---

[目次](#index)
#### ~~画像の表示~~
#### レンダリングの応用 <a id=rendering_ex></a>
<br>

~~entityMapにメタデータを追加することで画像の表示やテキストにリンク要素を追加できるらしい。~~ 参考サイトのコードは動作しないどころか、そもそも呼び出させない変数だかプロパティがあるのか、元々の状態を破壊してくれた。

レンダリングの応用で画像の表示もリンク要素も実装できそうだが……。

とりあえずリンクの紐づけだけは出来たのでコードを以下。
<span style="color:red"> 致命的な動作をするので非推奨。
`editorState` だかを常に監視し続けて変更がある度に更新を行うため、負荷が異常にかかる。無限ループでCPUが禿げてしまうので止めよう。
 </span>

```js
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
  return (
   <div contentEditable={!readOnly}>
     <a href={block.getData().get('link')} target="_blank">
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
```
上のコードは `function App` 内に記述している。
リンクを紐づけるテキスト（ブロック）は `unstyled` だか `xxxxx` キーで指定している状況ではあるが、今まで見たコードから継ぎ接ぎで書いたものなのでどちらかが不要になるような記法はあるかも。（今回指定しているのは、「ここだよ！」で、Googleを紐づけている）
現状だと、クリックしても遷移はしない。ただテキストに紐づいているだけ。 `onClick` 等で実装できるか？

→ とりあえず `draft-js-plugins` について調査、機能の検証をしてみる。

---

#### draft-js-plugins <a id=djp></a>
<br>

とりあえず導入から以下。
`$ npm install @draft-js-plugins/editor`
`editor` からインストールしなければエラーが起きる。
Link紐づけ機能のため、Anchorを導入。
`$ npm install @draft-js-plugins/anchor`
（何度かミスしたので一応残しておく。（plugin → plugins）（Anchor → anchor）間違えすぎた）

ローカル環境では `react-draft-wysiwyg` でツールバーを形成しているので、この場所でリンクの紐づけ（入力されたテキストと入力されたリンクで）をどうにかして実装したいところ。

---

#### エラー

多分バージョン等の問題、朝起動していきなり発生した。以下エラー文。
```bash
ERROR
[eslint] Plugin "react" was conflicted between "package.json »
 eslint-config-react-app »
  C:\Users\xxx-xxx\Desktop\git\xxx_matome\JS\draft-test-app\node_modules\eslint-config-react-app\base.js" and "BaseConfig »
   C:\Users\xxx-xxx\Desktop\git\xxx_Matome\JS\draft-test-app\node_modules\eslint-config-react-app\base.js".
```
明確な対処方法は不明だが、試したのは以下。
```bash
  npm remove eslint-config-react-app
  npm add --dev eslint-config-react-app
  npm install
```
上だけでは解消せず、以下の方法も追加で行った。
```bash
  npm update eslint
  npm update eslint-config-react-app
```
不安は残るものの無事動作するようにはなった。

<span style="color:blue">
Node.jsのバージョンを最新のものからv17.3.1（プロジェクトで指定されているバージョン）まで下げたところエラーが発生しなくなった。エラー文的にもバージョン周りでの問題のように思えるため、何処かのプラグインとそりが合わなかったと思われる。
</span>

---

#### 結論

日本語での情報は少なく、そもそも必要な情報が公開されていないことも稀に良くあるのでコレ使わない方がいい。ホントに。