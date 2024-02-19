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

# axios.js

HTTP通信（データの更新と取得）を簡易的に行うことのできるJSライブラリ。APIを提供しているクラウドサービスを利用しデータの受け渡しを可能にする。

## 目次

1. [インストール](#install)
2. [axios.get](#get)
3. [axios.post](#post)
4. [axios.delete](#delete)
5. [axios.put](#put)

## インストール<a id=install></a>

```bash
npm install axios
```

後ろに `--save` を付ければpackage.jsonにも追加されるはず。

## axios.get(url)<a id=get></a>

HTTP通信（API）でサーバーからデータを取得する。

```js
//GETリクエスト
const url = axios.get("http://localhost:8000/");

    .then(() => { //thenは成功時処理
        console.log("status_code:",status);
    })
    .catch(err=> {//catchでエラー時の処理を定義
        console.log("error:",err);
    });

//http通信で成功時はstatus_codeは200が返る。
```

## axios.post(url)<a id=post></a>

データをサーバーへ送信する。

```js
const data = {firstName : "Yoichi", lastName : "Yamakawa" }
const url = axios.post("http://localhost:8000/user/1", data)

    .then(() => {
        console.log(url):
    })
    .catch(err => {
        console.log("err:", err);
    });
```

## axios.delete(url)<a id=delete></a>

データを削除する。識別にデータIDを利用するため指定する必要あり。

```js
const url = axios.delete("http://localhost:8000/user/1")

    .then(() => {
        console.log("削除ID:", url);
    })
    .catch(err => {
        console.log("error:", err);
    });
```

## axios.put(url)<a id=put></a>

データを更新する。IDの指定が必要。

```js
const data = {firstName : "Taro", lastName : "Takahashi"}
const url = axios.put("htto://localhost:8000/user/1", data)

    .then(() => {
        console.log("データ更新:", url);
    })
    .catch(err => {
        console.log("error:", err);
    });
```