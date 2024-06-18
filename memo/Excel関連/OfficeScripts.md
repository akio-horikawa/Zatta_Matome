# OfficeScripts

Excelの自動化を行えるスクリプト。
VBAと違い、PowerAutomate等でオンライン上で呼び出すことができる。
言語的にはTypeScriptなのでExcel上の関数を気にしなければストレスフリー。

## 注意点

- ブックの保護、シートの保護は可能だが、APIによるアクセス保護を行うための権限が与えられていないためにファイルの暗号化ができない。
  - ブック、シートの編集は制限できるが、アクセス自体は制限不可。

## 基本

```
function main(workbook: ExcelScript.Workbook) {

}
```

処理はmain関数内に記述すればOK。
言語的にはTypeScriptなのでJSと同じ感覚で書ける。

## シートの保護

```
function main(workbook: ExcelScript.Workbook) {
    
    // 設定するパス
    const pass = "00";
    // アクティブなワークシートを取得
    let sheet = workbook.getActiveWorksheet();
    // シートの保護部分の取得
    let wsPro = sheet.getProtection();
    // シートが保護されているか
    if(wsPro.getProtected() === true){
        // 保護されているなら解除
        wsPro.unprotect(pass);
    } else {
        // シート保護時の追加設定
        // 無ければデフォ設定で保護
        let opt = wsPro.getOptions();
        
        //セルの書式設定
        opt.allowFormatCells = false;
        //列の書式設定
        opt.allowFormatColumns = false;
        //行の書式設定
        opt.allowFormatRows = false;
        //列の挿入
        opt.allowInsertColumns = false;
        //行の挿入
        opt.allowInsertRows = false;
        //ハイパーリンクの挿入
        opt.allowInsertHyperlinks = false;
        //列の削除
        opt.allowDeleteColumns = false;
        //行の削除
        opt.allowDeleteRows = false;
        //並べ替え
        opt.allowSort = false;
        //オートフィルターの使用
        opt.allowAutoFilter = true;
        //ピボットテーブルとピボットグラフを使う
        opt.allowPivotTables = false;
        //オブジェクトの編集
        opt.allowEditObjects = false;
        //シナリオの編集
        opt.allowEditScenarios = false;
        //すべてのセルの選択不可
        opt.selectionMode = ExcelScript.ProtectionSelectionMode.none;

        // シートの保護
        wsPro.protect(opt, pass);
    }
}
```

getprotection()とgetprotected()の辺りが面倒に感じる。
保護、保護解除周りで、必ずと言っていいほどgetprotection()は呼び出される。保護の操作で適用する範囲の選択に使用されているということ。

今回は、
```
...
  // アクティブなワークシートを取得
  let sheet = workbook.getActiveWorksheet();
  // シートの保護部分の取得
  let wsPro = sheet.getProtection();
...
  // シートの保護
  wsPro.protect(opt, pass);
...
```
となっているが、
```
...
  // アクティブなワークシートを取得
  let sheet = workbook.getActiveWorksheet();
...
  // シートの保護
  sheet.getprotection().protect(opt, pass);
...
```
のように書くこともできる。

## テーブル

```
const table = workbook.getTable('テーブル名');
```
テーブルの取得は上のコード。
ここから、
```
table.getName(); // => テーブル名
```
などなど操作可能。