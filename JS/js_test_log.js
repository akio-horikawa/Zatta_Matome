JavaScriptを使って実際に動かしたコード

// ---------------------------------------------------------------
/* いつものやつ
*  コンソールにHello World!が表示される。
*/
console.log("Hello World!");
// ---------------------------------------------------------------
/* letで宣言してみる
*  再代入可能
*/ 
let aud = "Hello World!"; 
aud; // aud == Hello World!
// ---------------------------------------------------------------
/* constとは何ぞや
*  再代入不可
*/
const bea = "hellO worlD?";
bea = "Hello World!"; // 再代入出来ないのでエラー
// ---------------------------------------------------------------
/* functionで遊んでみる
*  何回でも使える機能
*/
function dec(){ 
    console.log(this.text); // 呼び出された場所でtextを吐き出す
}; // console 決してconseleではない。
// ついでにconstも使う
const cor = {
    text : "Coral",
    func : dec,
};
const elf = {
    text : "Elf",
    func : dec,
};
//実行
cor.func(); // => Coral
elf.func(); // => Elf
/*
*  functionで宣言された場合はthisで指定されるモノが呼び出された時に決定される。
*  アロー関数と使い分けよう！
*/
// ---------------------------------------------------------------
// アロー関数も使ってみる。
const fue = () => {
    console.log(this.text);
};
// こっちもconstで宣言しておく。
const gan = {
    text : "Gand",
    func : fue,
};
// 実行
gan.func(); // => undefined
// アロー関数では宣言された時点でthisを確定させるため、呼び出せない。
text = "Decagramaton"; //変数そのまま指定出来て驚いた。基本やらないように。
// 実行
gan.func(); // => Decagramaton
/*前述の通りアロー関数は宣言時にthisを指定するが、
*  var、または変数宣言無しだとグローバルスコープとして宣言される。
*  一番前に読み込まれるため後から宣言しても読み込まれる。
*  const let だとundefindになることを確認。
*/
// ---------------------------------------------------------------
// dateあれやこれやを使ってみた
let hou = Date.now(); //現在の日時を数値で出力
hou; // ????
let ide = new Date(); //Dateオブジェクト出力
ide; // Thu Nov 16 2023 17:38:08 GMT+0900 (日本標準時)
let jap = ide.getTime(); // ミリ秒まで数値で出力
jap; //オブジェクトを数値に変換している？相変わらずわけがわからない。
let key = ide.toISOString(); //オブジェクトを文字列へ
key; // '2023-11-16T08:41:27.072Z'
// ---------------------------------------------------------------
let len = {};
len.x = 1;
let mio = Object.create(len);
mio.z = 2;
let nor = Object.create(mio);
nor.y = 3;
let owl = nor.toString();
nor.x + nor.z;
nor.z = 4;
mio.z; // => 2
nor.z; // => 4
// ---------------------------------------------------------------
