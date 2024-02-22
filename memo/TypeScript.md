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
    .markdown-preview.markdown-preview ul {
        font-size: 115%;
        text-decoration: underline;
    }
    .markdown-preview.markdown-preview pre { 
        box-shadow:  2px  2px  4px rgba(0,  0,  0,  0.2);
    }
</style>

# TypeScript

型指定できるJavaScript。

- JavaScriptの上方互換。
- 型定義が可能。
- インターフェース、クラスが使用可能。
- null/undefined safeにできる。
- 型定義ファイルがあれば外部ライブラリも型を利用可能。
- ジェネリックを使用可能。
- エディタによる入力補完が協力。

TypeScriptで記述したコードはコンパイルをかけることで、JavaScriptに変換され、ブラウザ等で利用できる。

## JavaScriptの上方互換

TypeScriptはJavaScriptの使用を拡張したものであるため、JavaScriptで記述した内容はTypeScriptでも使用可能。
☆コンパイラオプションで弾いている場合はその限りでない。

JavaScriptを知っているのであればTypeScriptの学習コストは低下する。また、JavaScriptの最新仕様を取り込んでいるため、JavaScriptの学習にもなる。

更に、ブラウザやサイト、アプリの設定に合わせ古い記法に変換するトランスコンパイラとしての機能も有している。

## 型定義が可能

JavaScriptの拡張機能として、型定義を可能にしている。
宣言した変数の値に型の制限を加えることができる。
つまりは、型の違う値が宣言した変数に代入された場合にerrorをはけるということ。

```js
let name: string; // name は文字列である
name = "apple pie!";
name = 0; // error
```

```js
const array: string[] = []; // 配列内には文字列を指定
array.push("apple pie!");
array.push(1); // error
```

関数の引数と戻り値の型も指定可能。

```js
function getName(id: string): string {
    // ...
    return "hina";
}
const name = getName("xxx")
console.log(name.length); // 4

function getAge(id: string): number {
    // ...
    return 17;
}
const age = getAge("xxx");
console.log(age.length); // error: ageはnumber型のため、lengthはない

const age2 = getAge(); // error: 定義された引数が無い

function getAge2(): number {
    return "hina"; // error: 戻り値の型が違う
}
```

引数が必須でないなら引数名の後に?を付ければいい。

```js
function getName(id?: string): string {
    // idがstringかundefinedを想定
    return "hina";
}
const name = getName("xxx");
console.log(name.length); // 4
// 型定義の後に = で値を渡すことでデフォルト値を設定
function getName2(id?: string = "xxx"): string {
    // idに値が渡されなければxxxが返る
    retune "hina";
}
```

いくつかのプロパティを持つオブジェクトを変数や関数で扱う場合にも名前と型を指定できる。

```js
const user: { name: string, age: number } = {
    name: "sorasaki",
    age: 17;
}
console.log(user.name); // sorasaki
console.log(user.aga); // error: プロパティ名違い
console.log(user.age.length); // error: ageがnumber型のためlengthはない
```

関数をオブジェクトとして扱う場合、関数だけで独立させる、引数に関数を与える、オブジェクトのプロパティとして関数を割り当てる、ことができる。

```js
interface IUser {
    name: string;
    // 一つの文字列の引数、戻り値が文字列の関数を定義
    getName: (keisho: string) => string;
}

class User implements IUser {
    name: string;
    // 引数の型、数、戻り値の型が違えばerror
    getName ( keisho: string ) {
        return `${this.name} (${keisho})`;
    }
}

const user = new User();
user.name = "sorasaki";
console.log(user.getName("さん"));
```

変数の宣言時に値を設定しておくことで、型宣言済みのように振舞わせることができる。

```js
const age = 18;
console.log(age.length); // error: ageはnumber型のためlengthはない
const user = {
    name: "sorasaki",
    age: 17,
};
console.log(user.age.length); // error: ageはnumber型のためlengthはない
```

関数の戻り値も同様に以下。

```js
function getUser() {
    return {
        name: "sorasaki",
        age: 17,
    };
}
const user = getUser();
console.log(user.age.length); // error: ageはnumber型のためlengthはない
```

変数や引数に複数の型の値が入ることが多いならTypeScriptでは参照時にキャストが必要になる。

```js
let nameOrAge: string | number = "sorasaki";
nameOrAge = 17;
nameOrAge = true; // error: string or number
console.log(nameOrAge.toString()); // 両方持っているメンバーなら参照可能
console.log(nameOrAge.length); // error: 型の特定をされていない
if(typeof nameOrAge === "string") { // lengthプロパティを持っているか
    console.log(nameOrAge.length); // 自動的にstringにキャスト
}
console.log((nameOrAge as string).length); // 明示的にキャストしても良い。numberが入り込む余地があるのが問題
```

文字列型に決まった値しか入らない場合の制御も可能。

```js
let status: "create" | "edit" | "view";
status = "creata"; // error: spellmiss
```

Javaのマップ型のようにv["Key"]のようにアクセスできる型を宣言できる。

```js
const stat: {[code: string]: string} = {
    '00': 'init',
    '10': 'loading',
    '20': 'complete',
};
stat['30'] = 'delete';
console.log(stat['00']); // -> "init"
```

文字列のユニオン型の利用も可能。
☆パイプで区切った"いずれかの型"を示すもの。

```js
type statusKeys = '00' | '10' | '20';
const stat: {[code in statusKeys]: string} = {
    '00': 'init',
    '10': 'loading',
    '20': 'complete',
};
stat['30'] = 'delete'; // error: keysに無いため
console.log(stat['00']); // -> "init"
```

関数の戻り値で、複数の値を返したい場合、オブジェクトでも良いが数が少ない場合では最初に文字列、次に数値等、決まった数、順番で返す設定にすると便利。

配列の数と順番が決まっている場合、型として定義したものをタプル型という。

```js
const createLog = (message: string): [Date, string] => {
    return [new Date(), `S:${message}`]
};
const [date, message] = createLog(`test`);
console.log(date.toISOString); // ISO8601 形式日付
console.log(message);
```

純粋な型ではなく、定義されている型を基にして変更された別の型を生成するUtility Typesも使用可能。OmitやPartialがよく使用される。
Omitは指定したプロパティを削除する。
Partialは全てのプロパティをOptional（undefinedの可能性がある（空を許容））にする。

```js
type UserType = {
    name: string;
    age: number;
};

type AgeOnly = Omit<UserType, 'name'>; // age: numberだけの型になる

type PartialUser = Partial<UserType>; // name?: string, age?: stringとなる
```

インターフェース、クラスも使用可能。JSで実装されている機能を拡張している。

```js
interface IUser {
    name: string;
    age: number;
}

class User implements IUser {
    // interface実装のため、同じプロパティを定義
    public name: string;
    public age: number;
    // getter setterの指定が可能
    public get displayName() {
        return `${this.name} ${this.keisho} (${this.age})`;
    }
    // public privateのアクセサも使用可能
    private keisho = "さん";
    // コンストラクタの定義 new したときに呼ばれる
    public constructor() {
        this.name = "";
        this.age = 0;
    }
}

const user = new User();
user.name = "sorasaki";
user.age = 17;
console.log(user.displayName);
user.displayName = "aa"; // error: 参照不可プロパティ
user.keisho = "くん"; // error: 未公開プロパティ

// interfaceから直接リテラルでオブジェクトを生成可能
const user2: IUser = {
    // interfaceで定義されたプロパティを指定されない場合、型が異なる場合はError
    name: "sorasaki",
    age: 17,
}
```

JSは簡単にundefinedが入り込み、実行時にエラーを引き起こすため、コンパイラオプションで `strictNullChecks` をonにすることでnullやundefinedの可能性をチェックすることを推奨。

```js
class Sample {
    public name: string; // error: 初期値が無いため
    public name2: string = ""; // 初期値あり
    public name3: string | undefined; // 明示的にundefinedを許可している
    public name4?: string; // undefinedの許可
    public name5: string | null; // error: nullとundefinedは違うものであるため
    public fn() {
        console.log(this.name3.length); // error: undefinedの可能性
        if (!!this.name3) {
            console.log(this.name3.length); // undefinedの可能性は排除されているため
        }
        console.log((this.name3 as string).length); // 明示的キャストはアリ　実行時エラーの可能性はある
    }
}
```

☆nullやundefinedのエラーが無いわけではないので注意。サーバとのデータ通信のほか、ユーザの入力値までチェックをかけることを忘れてはならない。

## 外部ライブラリも型を利用可能

ReactやjQuery、moment等のライブラリを利用する場合、JSで提供されているそれらの関数の引数、戻り値が何かは仕様書を確認せねばならない。

TSではライブラリがTypeScript用に型定義ファイルを提供している場合があるため、存在するならばライブラリのAPI情報を確認、コンパイル時のチェックが可能となる。

TypeScriptの型定義ファイルはnpmリポジトリに@types/[ライブラリ名]で提供される。

また、TypeScriptのシェアが広がっているためにメジャーなJSライブラリに型定義ファイルが同梱、提供されている場合がある。

型定義ファイルが無い場合は自分で `.d.ts` を記述することで回避可能。大抵はany型で定義してコンパイルを通すことになるが、型定義のチェックがされないためコーディングに注意が必要になる。

## ジェネリック使用可能

ジェネリックはクラスや関数内で使う型を抽象化して外部からその型を指定できるようにすることでその振る舞いを変更するもの。

主に汎用的なクラス、関数を定義する際に使用される。

```js
class Iterator<T> { // <T>がジェネリック宣言 Tは仮
    // class内ではT型となる
    private currentIndex: number = 0;
    private array: T[] = []; // 外から与えられる型で配列を定義
    // 配列に値を登録 引数はT型
    public push = (value: T) => {
        this.array.push(value);
    }
    public get = (): T => { // 関数の戻り値の型はT型
        // this.currentIndexが配列の数を超えた場合の確認は省略
        // this.arrayはT配列であるためvalueはT型
        const value = this.array[this.currentIndex];
        this.currentIndex += 1;
        return value;
    };
}

const numberIterator = new Iterator<number>(); // 数値型を扱う宣言
numberIterator.push(999);
numberIterator.push(998);
numberIterator.push("ghi"); // number型でないためerror

const a = numberIterator.get();
console.log(a.length); // aはnumber型でないためerror
```

## VSCによる入力補完が強力

VisualStudioCodeはTypeScriptと開発が同じなので、型定義から入力候補の表示など、入力補完が整っている。