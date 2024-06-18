# 開発内で知った、気づいたJavaScript、React、Next等々について。

## グローバル変数と表示

かなりわかりづらい。
レンダリングの処理が関わることによって `console.log` はデバッグ作業をあまり手伝ってはくれなくなる。
例えば、
```js
import { useEffect, useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';

// 取得するデータ
const [reportData, setReportData] = useState(null);

// 条件になるデータ
const [applepie, setApplepie] = useState(new Date());

const ReportPage = () => {

  const updateData = (date) => {
  	const firstDate = format(startOfMonth(date), 'yyyy-MM-dd');
    const lastDate = format(lastDayOfMonth(date) 'yyyy-MM-dd');

    const url = `/applepie?dateFrom=${firstDate}&dateTo${lastDate}`;

    axios.get(url)
      .then(res => {
        setsetReportData(res.data.reportData);
        console.log(reportData);
      })
      .catch(error => {
        setData(null);
      })
  };

    useEffect(() => {
			updateData(new Date(applepie));
		}, [applepie])

// ...以下return後JSXでPage設定
};
export default ReportPage;
```
では、updateData内の `axios.get` の成功時処理内でreportDataをコンソールに表示しようとしているが、初回レンダリング時には処理の順番的に中身が無いのでundefinedが返される。どうしても確認したいのならば、かなり恰好が悪いが以下。
```js
axios.get(url)
	.then(res => {
		reportData = res.data.reportData;
		setReportData(reportData);
		console.log(reportData);
	})
```
二度手間ではあるが、直接その場で宣言してしまえば問題なく取得したデータを表示できる。

原因は先ほども少し出した通りに処理の順番によるもの。レンダリングが絡んでいるため以下の状況よりも難解だが雰囲気だけでもわかるはず。
```js
for(i = 0; i < 3; i++){
	setTimeout(function(){
		console.log(i)
	}, 1000);
}
```
コードを読む限りでは `setTimeout` によって一秒ごとに繰り返しの条件に設定されている `i` をコンソールに表示するもの。普通に考えれば `1 2 3`だが、実際は `3` が繰り返し表示されてしまう。

変数がグローバルスコープであるために、 `console.log` の実行より前にループが完了されてしまう。
```js
for(let i =0; i < 3; i++)
```
ならば、変数であるiがループ間で共有されないために問題なく想定通りの挙動をしてくれる。

## setTimeout

`setTimeout` は正確には実行を遅らせるための関数ではない。
あくまで、第一引数に指定した関数がタスクキューに入れられるまでの時間を第二引数で設定できる（第三引数で第一引数に引数を渡せる）。
つまり第二引数で指定した時間（msec）経過後にタスクキューに加えられるので、設定した時間後に関数が実行されるわけではない。そのため、第二引数が `0` であっても通常タスクキューに加えられるものよりも低い優先度で加えられる。

### ()は付けないこと

第一引数には関数を指定することになるが、間違っても()を付けないこと。要するに以下の状況。
```js
setTimeout(applepie(), 1000);
```
()を付けるだけで関数の指定ではなく、関数の実行ということになる。そのため、ここでは `applepie()` が結果は当たり前にundefinedなので何もタスクキューに入れることができない。