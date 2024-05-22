# PowerApps

Microsoft365から利用。SharePoint上にlistを作成して連携、Databaseのようにして利用する。見た目上はコンポーネントを置くのみ。コンポーネント内部に処理を書き込むなどして設定を行う。物によってはOnChange等の設定が行えないものも有る為、工夫が必要。画面遷移と画面間でのデータの受け渡し自体は容易。

## インポートとエクスポート

PowerAppsで作成したアプリは専用のパッケージとしてエクスポート可能。設定を変更しなければ「更新」用のパッケージがダウンロードできるはず。
「更新」用のパッケージはすでにマイアプリに存在するアプリに対して更新を行うものであり、アプリのバックアップ用のものである。
これと別に「新規作成」のパッケージがあり、これはマイアプリ内にインポートしたパッケージのアプリを新しく作成するものである。
どちらのパッケージでもインポート時には、他の機能（SharePointやAutomate）などとの接続を行うアカウントを設定する必要がある。

__とりあえず変更を行う前にバックアップとしてエクスポートすべき。__

PowerAppsは「公開」をしなければ更新者以外からは環境が変化しないが、更新者の環境では自動保存によってかなりの頻度で更新が保存されていく。

#### SharePoint連携

PowerApps内、左メニューからデータ（見た目：ドラム缶）を選択。元データを検索する等して設定。Galleryの設定で紐づけることで画面に表示できる。見た目はコンポーネント（ラベル等）を設定して整える必要がある。
☆データ欄にはClearCollect、Collectで絞り込んだデータが保持される。画面遷移後にデータを渡したいとき等に利用できる。

#### PowerAutomate連携

PowerApps内、左メニューからPowerAutomate（太い矢印（右向き））を選択。当然の如く、AutomateでAppsでの呼び出しをトリガーにしたフローが無ければ意味がない。また、Automateのフロー内でSharePoint等の接続状況だったり、参照するデータを変更した場合にはApps側で設定しているAutomateの状態を更新（再読み込み？）をしてあげないと上手く動かなくなる。

### Collect / ClearCollect

`Collect(データソース, レコード, ...レコード)` `ClearCollect(データソース, レコード, ...レコード)` コード的には差はほとんどない。ClearCollectは一度データソース内をクリア（削除）してからレコードを追加する。Collectの方はクリアしないのでレコードは追加されるだけ。

### Filter

`Filter(テーブル, 条件, ...条件)` テーブル内から指定した条件に合うデータだけ抜き出す。Collectのレコード指定等で利用。

```
Collect(DateSource,
    Filter(Table,
        ID = SelectID,
        Name = DeployName,
        Date =< SelectDate
    )
)
```

### Distinct

`Distinct(テーブル, カラム, ...カラム)` テーブル内の指定したカラム内で重複するデータを削除する。カラムの指定が無ければ全カラムで重複削除を行う。

```
Collect(DataSource,
    Distinct(
        Filter(Table,
            Name = DeployName,
            Date =< SelectDate
        )
        ,
        ID
    )
)
```

### AddColumns

`AddColumns(テーブル, 列名1, 数式1, ...)` Collect関数などで設定したコレクションにカラムを追加する関数。

```
Collect(DataSource2,
    AddColumns(
        Datasource,
        testData,
        thisItem.testData
    )
)
```

### Patch

`Patch(テーブル, 基本のテーブル, レコード1, ...)` SharePointのリストなど、データソースの更新と新規作成などを行う関数。新規登録自体は、対象とするテーブルの指定ができれば単純にレコードを記述するだけ。更新に関してはConcatenate等でテキストの指定をしつつ行うことになる。

```
Patch(DataSource,
    Defaults(DataSource),
    {
        ID: thisItem.ID,
        Name: thisItem.Name
    }
)
```

### Defaults

`Defaults(データソース)` データソースの規定の状態を取得する関数。使用方法もまんま。