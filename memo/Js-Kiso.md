# JavaScript_学習メモ

---

このメモは、 __JavaScript__ を学習するために、1~10までをマメに記述する予定のメモ。三日坊主で終わらないことを切に願っている。因みに学習用に教本として【オライリージャパン】の【JavaScript_第7版】 __（税込5,060円）__ を使用している。本当に三日坊主で終わらないようにしないと後悔することになる。

---

## 目次 <a id = mokuji></a>
[１章 JavaScript概要](#1)  
[２章 字句構造](#2)  

---
<a id = 1></a>
## １章 JavaScript概要

JavaScriptとは、Webのためのプログラミング言語。ほぼ全てのWebサイトで使用されていて、スマホ等の最新ブラウザにおいても全てにJavaScriptインタプリタが搭載されている。

→　インタプリタ　：　通訳者。Compでプログラムを処理する方法の一つ。実行時にソースコードを一行ずつ機械語に変換するのが特徴。

JavaScriptはJavaと名前が似ているが両者は全く違う言語であり、似ているのは名前のみである。最初こそスクリプトとして実装されたJavaScriptは現在では大規模ソフトウェアを作成する際にまで利用されている。

全ての言語には負担軽減のためのプラットフォームや標準ライブラリが含まれているが、コアJavaScript言語には最小限のAPIのみが定義されている。ホスト環境で提供される前提のため、入出力機能は含まれていない。Web上でのJavaScriptのコードはユーザーのマウスやキーボードからの入力、Webサーバからの情報の受け取りを行うことができる。

私個人としては、この場所に限ってはWebシステムのためではなく、JavaScriptという言語の基礎的な、基本的な仕様等に注目して学んでいきたい。

#### いつもの

ブラウザで開発者ツールなどからコンソールを開く他、Node.js等を導入してターミナルからJavaScriptの簡単なコードを試すことができる。`console.log("Hello World!")`を動作させてみれば、見慣れた表示がコンソールで確認できるはず。

---
<a id = 2></a>
## ２章 字句構造

JavaScriptは大文字小文字を区別する。変数や関数名、識別子では厳密に区別されるために気を付ける必要がある。トークンを区切る空白の他、一般的に改行を無視するため、プログラム内では自由に空白と改行を使用可能である。

→　トークン　：　証拠。ソースコード上でそれ以上分割できない最小単位の文字列。

#### コメント

コメントは `//ここにコメント` や `/* ここにコメント */` のように記述する他、 `// => 値 or "値" :ここにコメント` のように記述することができる。最後のコメント方法はアサーションとして機能し、コードの検証に利用することが可能。（それとは別に検証用のコードが必要になる）

→　アサーション　：　自己主張。プログラミングにおいて、あるコードが実行される時に満たされるべき条件を記述して実行時にチェックする仕組みのこと。

アサーション用のコメント記法には他に `//a == 値` 、 `// !例外` のようなものも存在する。

#### 識別子

識別子は変数や関数、クラスに付けられる名前のこと。先頭は数字以外でなければならず、予約語である元々設定されている語句を使用することはできない。

#### 予約語

予約語はJavaScript言語の一部として使用されているため変数やクラスの名前として使用することは不可である。 `from` 、 `of` 、 `get` 、 `set` 等は、予約語として使用される場面が少ない上に、識別子として使用されやすいものなので利用すべき。以下は予約語の例。

```
as async await break case catch class const continue 
debugger default delete do else export extends false 
finally for (from) function (get) if import in instanceof 
let new null (of) return (set) static super switch target
this throw true try typeof var void while with yield
//以下は将来的に予約語とされている。
enum implements interface package private protected public
```

また、特殊な理由で特定状況下では `arguments` と `eval` は識別子として利用不可のため、普段から仕様は避けるべきである。

#### Unicode

JavaScriptはUnicode文字コードを使用して、文字列やコメントを記述できる。しかし、識別子に関してはASCII文字か数字を使用するのが一般的となっている。慣習なので気にせずUnicodeを識別子として使用することは可能。

#### エスケープシーケンス

エスケープシーケンスとは、Unicodeを表現するために並べられたASCII文字の並びのこと。全ての環境でUnicodeが表示できるわけではないために、 `\u` で始まり、後ろに4文字の16進数を記述する。その他、中括弧内で1~6文字の16進数を記述することで表せる。コメント内にもエスケープシーケンスを記述できるが、単にASCII文字として扱われるだけでUnicode文字として解釈されることはない。

#### Unicode正規化

JavaScriptではUnicodeの正規化処理は行わないため、Unicode文字を使用する場合はエディタ等で正規化を行うと見た目は同じでも実際にはデータが違うような識別子に悩まされなくなる。

#### 省略可能セミコロン

JavaScriptでは文末のセミコロンは省略可能。しかし、文の終端を示すものなので有って悪い事はない。セミコロンがない場合は改行を終端と解釈するが、括弧などで文が始まった時、前の文章の続きだと解釈されてしまう場合があるため、中々良くない状況になる。これを避けるために文の最初にセミコロンを記述する人もいる。その他にも、 `++` や `=>` 等は一つの文で表した方が良い。

---

<a id = 1></a>
## ３章 型・値・変数

#### 型

JavaScriptの型には基本型とオブジェクト型が存在する。基本型には数値や文字列、論理値がある。また、JavaScriptの特殊な値である `null` や `undefined` も基本型の値である。それ以外の値がオブジェクト、プロパティの集合体である。

→　プロパティ　：　属性。オブジェクトの状態や属性のことをいう。

#### 数値

JavaScriptにおいて数値型は整数と大凡の実数を64ビット浮動小数で表す。プログラム内に直接記述される数字は数値リテラルと言い、全ての数値リテラルは前に `-` をつけることで符号を反転できる。

##### 整数リテラル

10進数は数字をただ並べるのみ。
`1000000`
16進数は先頭が 0x or 0X で後ろには16進数値が続く。
`0xff // => 255`

##### 浮動小数点リテラル

JavaScriptでは実数は浮動小数点リテラルを使用して表す。先頭を整数部、続いて小数点、小数部という形式である。指数は e or E の次に (+) or (-) 、次に整数指数という形式で小数部の後ろに記述することになる。

また、数値リテラル内ではアンダースコアが自由に使えるため、見やすさを重視するなら活用すべきである。

##### JavaScriptでの算術演算

JavaScriptの基本的算術演算子には、 加算(+)、減算(-)、乗算(*)、除算(/)、剰余(%)、べき乗(**)が使用可能であり、より複雑なものはMathプロパティに定義されている。