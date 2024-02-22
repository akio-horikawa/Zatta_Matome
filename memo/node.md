<style>
    .markdown-preview.markdown-preview {
        background-color: white;
        border:  5px solid skyblue; 
        box-shadow: inset  0  0  0  2px lightgrey;
    }
    .markdown-preview.markdown-preview p{
        color: #000;
        padding-left: 15px;
    }
    .markdown-preview.markdown-preview h1 {
        color: white;
        background-color: skyblue;
        padding: 2px 2px 2px 2px;
        padding-left: 10px;
        text-shadow: 1px 2px 1px #ccc;
        box-shadow:  2px  2px  4px rgba(0,  0,  0,  0.5);
    }
    .markdown-preview.markdown-preview h2 {
        color: white;
        background-color: skyblue;
        padding: 2px 2px 2px 2px;
        padding-left: 10px;
        text-shadow: 1px 2px 0 #ccc;
        box-shadow:  2px  2px  4px rgba(0,  0,  0,  0.5);
    }
    .markdown-preview.markdown-preview ol {
        font-size: 115%;
        text-decoration: underline;
    }
    .markdown-preview.markdown-preview pre { 
        box-shadow:  2px  2px  4px rgba(0,  0,  0,  0.2);
    }
</style>

# Node.js

JavaScriptのコードを従来の仕様に合わせる等、決まった形式のものに変換（トランスコンパイル）する必要がある。変換を行うツール（トランスコンパイラ）の主流がBabel、それを動作させるための環境として使用されるのがNode.js。

Webアプリケーションを作成する際、JavaScriptでコードを書くなら実行環境がNode.jsとなる。フレームワークとしてよく使用されるのはExpressやNext.jsがある。

元々Node.jsは大量の同時接続をさばけるようなネットワークアプリを構築するために設計されているため、Webサーバの役割もNode.jsがこなす特徴がある。Webサーバの機能から一貫してNode.jsが受け持ち、効率的な処理を行うようになっている。

ApacheやnginxのようなWebサーバの代わりにNode.jsが直接HTTPリクエストを受け取り、処理を行う。実際にはWebサーバとしての機能としては機能が足りないため何かしらで補うことが多い。

☆Node.jsはサーバサイド言語ではない。JavaScriptでサーバサイド側を実装できるということ。

とは言え、React等のフロントエンド開発にも使用される。ローカルサーバの使用やTypeScriptコンパイラ、Babel（トランスコンパイラ）の利用のため、必要になる。（使用しないと自身で設定することになるのでかなりキツイ）

## npmインストール

Node Package Manager。世界中で作成されたJavaScriptモジュールを利用可能にするシステム。Node.jsと共にインストールされ、Node.jsの実装をnpmを活用して行うことになる。

npmに登録されているパッケージであれば簡単にインストール可能。

```bash
npm install ...
npm uninstall ...
npm update ...
npm ls 
// インストールしたモジュールの一覧
```

npmでインストールしたパッケージは勝手にnode_modules配下にインストールされる。import、requireで使用可能に。

何も指定しないか、末尾に `--save` を付与することでローカルにインストールされる。

installの後に `-g / --global` を付与することでグローバル（システム全体）にインストールされる。
☆グローバルインストールはpackage.jsonに詳細が追記されないため、チーム開発時には必ずローカルでインストールする事。

npmでインストールするパッケージは本体がリモートであるため、取得してインストールをするクライアントはnpmである必要はなく、yarnのほうが高速かつ信頼性が高い。依存関係も安全を保てたりする。

## Package.json

プロジェクトの基本情報。 `npm init` で作成される。
モジュールのバージョン情報などが記述される。

