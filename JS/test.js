
//いつものやつ
console.log("Hello World!");

//letで宣言してみる
let aud = "Hello World!"; //audにいつものやつを代入して宣言
aud; // aud == Hello World!

//constとは何ぞや
const bea = "hellO worlD?"; //constに定数を代入して宣言
bea = "Hello World!"; //再代入出来ないのでエラー

//functionで遊んでみる
function dec(){ //何回でも使える機能
    console.log(this.text); //呼び出された場所でtextを吐き出す
};
//ついでにconstも使う
const cor = {
    text : "Coral",
    func : decodeURI,
};