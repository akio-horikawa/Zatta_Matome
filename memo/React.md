# React

---

Reactとは、JavaScriptのライブラリの一つで、Viewレイヤ（？）のJavaScriptフロントエンドフレームワーク（？）である。

細々した内容をコンポーネントにまとめて、複雑なUIでもコンポーネントの呼び出しを組み合わせて作成する、できるようにするもの。テンプレではなくJavaScriptで記述することでDOM（Document Object Model）の外でも状態を保持できるらしい。

---

基本的内容はJavaScriptと相違ないはずなので、気づいた点があれば追記。

---

#### ローカル環境

準備
- Node.jsをインストール。
- npmをインストール。

簡易的かつローカルならば以下。
`npx create-react-app file名`

ライブラリ、モジュール、スクリプト等、重複や競合が起きるとエラーが出る。バージョンの兼ね合いも原因の一つになる。勘弁してください。

---

#### return内部（JSX）での式の使用（仕様？）

JSX内にJavaScriptの式を入れるときは `{}` で囲うとちゃんと動作してくれるらしい。動作するのは式のみ。宣言文等の文に関しては動作しないようなので要検証か？