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

---

#### Hooks

- useState
    関数コンポーネントのstateの保持、更新用。
- useEffect
    関数コンポーネントで副作用の制御用。
- useContext
    複数コンポーネント間で共通して利用したいデータを管理。
- useRef
    refオブジェクトを生成する。DOMに触れ、値を保持することができる。
- useMemo
    関数が出力した値を保持。
- useCallback
    関数をメモ化してパフォーマンスの向上を実現。
- useReducer
    複雑なstateを管理。

---

#### chakra-ui

Reactアプリケーションを構成するためのブロックを用意してくれているもの。hoverだったり、Box単位でのフォントサイズやテキストの色等（CSSみたいなこと）を設定できたりする。

インストールは以下。（必ず適用するアプリケーション内で行うこと）
`npm install @chakra-ui/react`

インポートは以下。
`import {Box, Tooltip, ...etc} from @chakra-ui/react`

以下、使用してわかったことなど。

```
import {Box, Tooltip, extendTheme, ChakraProvider} from "@chakra-ui/react";

const customTheme = extendTheme({
  fonts: {
    heading: "游ゴシック体, Yu Gothic, YuGothic, sans-serif",
    body: "游ゴシック体, Yu Gothic, YuGothic, sans-serif",
    },
  components: {
    Tooltip: {
        baseStyle: {
          fontSize: "0.1em",
          fontWeight: "bold",
          backgroundColor: "blue.400",
          padding: "2px",
          borderRadius: "2px",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
        },
    },
  },
})

function App() {
 return (
    <div>
      <header className="App">
        <Box display="inline-block" fontFamily="Yu Gothic, sans-serif">
          <ChakraProvider theme={customTheme}>
            <Tooltip label = "test" placement="left" fontSize="md">
              <div>
                Apple Pie!
              </div>
            </Tooltip>
          </ChakraProvider>
        </Box>
 );
}
```

上のコードは恐らく（書いたコードを短くまとめたものなので特に動作を確認していない）"Apple Pie!"にカーソルを合わせたときに"test"という表示が左に（場所的に余裕がなければ→に）青背景とともに表示されるはず。
<span style="color: blue"> 
    まず上の方から、importは使用するものを随時追加するだけなのでいつもどおり。<br>
    customTheme = extendThemeの部分は、chakra-uiのデフォルトの設定を上書きするもの。当然のように設定していない部分に関しては、勝手にデフォルトに上書きするので注意。別のCSSファイルからStyleを設定していても、優先されるので注意すること。ここでは、fontsで再度設定することで対応している。Tooltip内はホバー時の表示の設定。<br>
    function(){retrun}内は、いつもどおりにJSXだが、最外を何かで囲む必要がある。また、Box単位で設定ができるので、活用すべき。ChakraProviderは曲者だが、一度クセを理解できれば有効に扱えるはず。因みにBoxの外側においても問題ないどころか、単体ならそっちのほうが普通かもしれない。
</span>