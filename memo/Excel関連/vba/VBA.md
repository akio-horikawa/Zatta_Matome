# VBA

Excelの操作を自動化する「マクロ」、の中身のプログラム。VBA（Visual Basic Application）はプログラミング言語。

---

## 準備

1. Excelを起動してリボンに「開発」タブを追加。
   1. 「ファイル」から「オプション（設定）」、「リボンのユーザー設定」から「開発」にチェックを入れる
2. 「開発」タブの一番左の「Visual Basic」をクリックしてエディタを開く。
3. エディタの初期設定をする。
   1. 「ツール」から「オプション」を開く。
   2. 「自動構文チェック」のチェックを外す。
   3. 「変数の宣言を強制する」にチェックを付ける。
4. マクロを記述する場所の用意として、メニューの「挿入」から「標準モジュール」をクリック。

---

## マクロVBA記述

!!! note 前提

      マクロを記述する上で、Excelファイル（ブック）を __マクロ有効ブック__ にする必要がある。
      「名前を付けて保存」等で「ファイルの種類」を「Excel マクロ有効ブック(*.xlsm)」にする。

!!! note 準備

      1. 「開発」タブから「Visual Basic」か、「Alt + F11」でエディタを開く。
      2. 標準モジュールが無ければ挿入する。

### いつもの

新規挿入したならば、標準モジュール下に「Module1」があるはずなので、「Module1」に記述していく。 __小文字で入力すること。__

```vb
Option Explicit

Sub 練習1()
   MsgBox "hello world"
    
End Sub
```

!!! note 仕様

      `Sub` や `MsgBox` は小文字で入力すると、「Enter」で改行した時に自動で大文字に変換する。（ `sub` -> `Sub` ）<br>
      `Sub` 追加後に「Enter」で `End Sub` が自動で追加されるはず。

!!! note 実行

      - 「実行」から「Sub/ユーザーフォームの実行」をクリック。
      - 「右向きの緑色の三角アイコン」をクリック。
      - 「F5」を押す。

上記の「Sub」を実行すれば、メッセージボックスが表示される。
以上でマクロの記述方法は終了。

!!! note 複数のマクロ記述

      一つのモジュールに上記手順で複数のマクロを記述できる。自動で入力したものを整えてくれるので、小文字で入力すべきだし、当然の如くインデントをつけるべき。

!!! warning プロシージャ

      VBAにおける「マクロ」の正式な呼称は「プロシージャ」である。また、「Sub」の横に記述するものが「プロシージャ」の名前であり、制限は以下。
      - 英数大小文字、全角。
      - 英記号はアンダーバーのみ。
      - 先頭は数字以外。
      - 同一モジュール内で同名はNG。

---

## セルに数字、文字を入力

Excelの基本単位であるセルを操作する扱いについて。

```vb
Sub 練習3()
    Range("A1") = "hello world"
    Range("A2") = 12345
    
End Sub
```

!!! note Range()

      「Range("セル番号") = "文字"」か「Range("セル番号") = 数字」でセルを指定して入力可能。

!!! warning

      記述時のセル番地は通常と違い、大文字で記述する。

```vb
Sub 練習4()
    Cells(3, 1) = "good bye"
    Cells(4, 1) = 54321
    Cells(5, "A") = "列番号で指定"
    Range("A6:C6") = "一括入力"
    Range(Cells(7, 1), Cells(7, 3)) = "一括入力2"
    
End Sub
```

Range以外にもCellsで単一のセルを指定可能。

!!! note Cells
      Rangeとの違いは、Rangeが `Range("列記号", 行数)` での指定に対し、Cellsは `Cells(行数, 列数)` となっている。
      （ `Cells(行数, "列記号")` での指定も可能）

rangeではシート上での計算式と同様に「開始セル:終了セル」でセル範囲の指定も可能。指定するセルの記述は行、列記号以外にCellsでの指定も可能。

---

## セルの値から計算

```vb
Sub 練習5()
    Cells(9, 3) = Cells(9, 1) + Cells(9, 2)
    Cells(9, 4) = Cells(9, 1) - Cells(9, 2)
    Cells(9, 5) = Cells(9, 1) * Cells(9, 2)
    Cells(9, 6) = Cells(9, 1) / Cells(9, 2)
    
End Sub
```

上記コードはセルの9行目1列と2列を使って四則演算を行うもの。結果はそれぞれCellsで指定したセルに入力される。

!!! warning Rangeでも指定できるが...

      セル位置が移動する可能性があるならRangeよりもCellsの方が都合がいい。
      そもそも単一のセル指定はCellsで行うのが基本であり、Rangeは範囲を指定するものであり、また、セル位置を明確にしたい訳でなければ特にメリットは無い。

```vb
Sub 練習6()
    Cells(11, 4) = (Cells(11, 2) + Cells(11, 3)) * Cells(11, 1)
    Cells(11, 5) = WorksheetFunction.Round(Cells(11, 4) * 1.08, 0)
    
End Sub
```

少し複雑化した計算に関しても別段特殊なことはない。ただ、少数が適していないデータを扱う場合は切り捨てならINT関数...など関数の利用が必要になる。 `WorksheetFunction.関数名(引数)` の形で利用する。

---

## 変数と繰り返し

練習7の前に使用するデータを準備したい。
直接入力するよりもプロシージャを利用した方が練習になる。

```vb
Sub data1()
    Cells(12, 1) = "単価"
    Cells(12, 2) = "数量"
    Cells(12, 3) = "金額"
    Dim i
    For i = 13 To 23
        Cells(i, 1) = WorksheetFunction.RandBetween(100, 300)
        Cells(i, 2) = WorksheetFunction.RandBetween(5, 20)
    Next
    
End Sub
```

とすると、変数と繰り返し処理が必要...便利なので先に知っておきたい。

!!! note 変数の宣言

      初期設定時に、 `「変数の宣言を強制する」にチェックを付ける。` と設定した為に、 `Dim 変数名` のような形で変数を宣言できる。

!!! note 繰り返し
      繰り返し処理はわかりやすく、
      ```vb
      For i = 1 To 10
         ...処理
      Next
      ```
      という形で記述する。
      パッと見で理解できるが、Forの後に初期値を設定して、Toの後でどこまで繰り返すか指定、ForからNextまでの処理を繰り返す。

```vb
Sub 練習7()
    Dim i
    For i = 13 To 23
        Cells(i, 3) = Cells(i, 1) * Cells(i, 2)
    Next
    
End Sub
```

また、特定の数値毎に繰り返したい場合はStepをFor文に追加する。

```vb
Sub test1()
    Cells(12, 4) = "値引き後"
    Dim i
    For i = 13 To 23 Step 2
        Cells(i, 4) = Cells(i, 3) - 200
    Next
End Sub
```

上記コードならセルを一つ飛ばししながらデータを処理してくれる。初期値から値を下げていく場合なら `Step -1` となる。

---

## 表の先頭から最終行までの繰り返し

表は項目を指定する横方向には滅多に増加しないが、データが追加される以上は縦方向に増え続ける。何らかの処理を加えたいときは最後方のデータを指定したいはず。

!!! note
      と、準備をするにあたって、今までのマクロ実行でシートが散らかっていたため、新しいシートで実行してみた。（コードは以前のものとほぼ同じ）

      ```vb
      Sub data2()
         Cells(1, 1) = "単価"
         Cells(1, 2) = "数量"
         Cells(1, 3) = "金額"
         Dim i
         For i = 2 To 12
            Cells(i, 1) = WorksheetFunction.RandBetween(100, 300)
            Cells(i, 2) = WorksheetFunction.RandBetween(5, 20)
         Next
      End Sub
      ```

      実行した時に、（指定が無いのなら）開いているシートに対してマクロが走る、ということをもう少し早く知りたかった。

用意したデータの最終行を取得したい。

過程を端折ってしまえば、シートの最終行からデータのあるセルまで移動させてしまえば、票の一番下、最終行が取得できる。

```vb
Cells(Rows.Count, 1).End(xlUp).Row
```

`Cells()` はセルの指定、 `Rows.Count` はシートの最終行、 `.End(xlUp)` データのあるセルへの上移動、 `Row` 行数。（データのあるセルへの下移動は `.End(xlDown)` ）

最終行までの繰り返しは、For文のToに上記のコードを指定すればいい。

```vb
Sub 練習8()
    Dim i
    For i = 2 To Cells(Rows.Count, 1).End(xlUp).Row
        Cells(i, 3) = Cells(i, 1) * Cells(i, 2)
    Next
End Sub
```

---

## 条件分岐

まずはデータの準備をする。既に条件分岐を使ってしまう...

```vb
Sub data3()
    Cells(1, 1) = "単価"
    Cells(1, 2) = "数量"
    Cells(1, 3) = "税込/税抜"
    Cells(1, 4) = "税込金額"
    Dim i
    For i = 2 To 12
        Cells(i, 1) = WorksheetFunction.RandBetween(100, 300)
        Cells(i, 2) = WorksheetFunction.RandBetween(5, 20)
        Dim tax
        tax = Cells(i, 1) / 2
        If Cells(i, 2) Mod 2 = 0 Then
            Cells(i, 3) = "税込"
        Else
            Cells(i, 3) = "税抜"
        End If
    Next
        
End Sub
```

上記コードから生成されるデータでは、金額を求めるために税込か税抜かで計算方法を変える必要がある。

!!! 条件分岐

      If文は以下の通り。

      ```vb
      If 条件 then
         ...真のときの処理
      Else
         ...偽のときの処理
      End If
      ```

      偽のときの処理が無いのなら、 `Else` を省略する。
      また、ElseIfも存在する。

      And、Orで条件を追加する事も可能。

一応流れとして、税込時の処理として以下。

```vb
Sub 練習9_1()
    Dim i
    For i = 2 To 12
        Cells(i, 4) = Cells(i, 1) * Cells(i, 2)
    Next
End Sub
```

税抜時は以下。

```vb
Sub 練習9_2()
    Dim i
    For i = 2 To 12
        Cells(i, 4) = WorksheetFunction.Round(Cells(i, 1) * Cells(i, 2) * 1.08, 0)
    Next
End Sub
```

表の中が税込か税抜で統一されていれば上記のどちらかで済む。今回はそうでないため、条件分岐を設定する必要がある。

```vb
Sub 練習9_3()
    Dim i
    For i = 2 To 12
        If Cells(i, 3) = "税込" Then
            Cells(i, 4) = Cells(i, 1) * Cells(i, 2)
        Else
            Cells(i, 4) = WorksheetFunction.Round(Cells(i, 1) * Cells(i, 2) * 1.08, 0)
        End If
    Next
End Sub
```

!!! note 文が長い時

      文に続いて、 ` _` と半角スペースとアンダーバーを記述すれば、次の行にその文の続きを記述できる。

---

## 課題1

```vb
Sub date4()
    Cells(1, 1) = "英語"
    Cells(1, 2) = "数学"
    Cells(1, 3) = "国語"
    Cells(1, 4) = "理科"
    Cells(1, 5) = "社会"
    Cells(1, 6) = "合計"
    Cells(1, 7) = "判定"
    Dim i
    For i = 2 To 10
        Cells(i, 1) = WorksheetFunction.RandBetween(40, 100)
        Cells(i, 2) = WorksheetFunction.RandBetween(40, 100)
        Cells(i, 3) = WorksheetFunction.RandBetween(40, 100)
        Cells(i, 4) = WorksheetFunction.RandBetween(40, 100)
        Cells(i, 5) = WorksheetFunction.RandBetween(40, 100)
    Next
End Sub
```

- 上記コードで生成されるデータの「合計」と「判定」を求めるプロシージャを記述する。
- 合計は生成される五教科の合計点を入力。
- 判定は「合格」か「不合格」を入力。
  - 合格条件は合計点が350以上であり、「英語」、「国語」、「数学」の点数が70点以上であること。

<details>
<summary>答え一例</summary>

```vb
   Sub 練習10()
      Dim i
      For i = 2 To 10
         Cells(i, 6) = Cells(i, 1) _
                     + Cells(i, 2) _
                     + Cells(i, 3) _
                     + Cells(i, 4) _
                     + Cells(i, 5)
         If Cells(i, 6) > 349 And _
            Cells(i, 1) > 70 And _
            Cells(i, 2) > 70 And _
            Cells(i, 3) > 70 Then
            Cells(i, 7) = "合格"
         Else
            Cells(i, 7) = "不合格"
         End If
      Next
   End Sub
```

</details>

---

## 範囲消去

表の更新処理などでは、表の範囲を消去してから別の処理を走らせることが多い。

```vb
Sub data5()
    Cells(1, 1) = "店舗"
    Cells(1, 2) = "売上"
    Cells(1, 3) = "客数"
    Dim i
    For i = 2 To 11
        Cells(i, 1) = "店舗" & i
        Cells(i, 2) = WorksheetFunction.RandBetween(95000, 300000)
        Cells(i, 3) = WorksheetFunction.RandBetween(90, 300)
    Next
End Sub
```

今回は上記コードで作成されるデータを使って範囲消去を試す。

セル範囲消去は二種類。
- セル範囲.Clear
- セル範囲.ClearContents

Clearが書式ごと削除してセルを初期状態にするのに対して、ClearContentsはセルの値のみ消去する。

```vb
Sub 練習11_1()
    Dim i As Long
    i = Cells(Rows.Count, 1).End(xlUp).Row
    Range(Range("A2"), Cells(i, 3)).ClearContents
End Sub
```

上記のプロシージャを実行すると、データ部分が消去される。
しかし、何らかの形で二回目が実行されると見出しまで消去されてしまう。

!!! note 型指定

      ```vb
      Dim 変数名 as 型名
      変数名 = 値
      ```

      上記のように変数の宣言時に型を指定できる。

```vb
Sub 練習11_2()
    Range("A1").CurrentRegion.Offset(1, 0).ClearContents
End Sub
```

見出しを消去しないようにしたものが上記。
`Range("A1").CurrentRegion` で表全体の範囲となる。 `Offset(行, 列)` はその選択範囲を引数分ずらすもの。

とはいえ、上記のコードでは店舗の区分まで削除してしまっているので、列もずらす必要がある。

```vb
Sub 練習11_3()
    Range("A1").CurrentRegion.Offset(1, 1).ClearContents
End Sub
```

---

## 関数

多すぎて全ては無理なので、頻出するもの20個の動作を確認した。

```vb
Sub data6()
    Cells(1, 1) = "Apple pie!"
    Cells(1, 2) = Left(Cells(1, 1), 5)
    Cells(1, 3) = Right(Cells(1, 1), 4)
    Cells(1, 4) = Mid(Cells(1, 1), 7)
    Cells(1, 5) = Len(Cells(1, 1))
    Cells(2, 1) = Replace(Cells(1, 1), "p", "P")
    Cells(2, 2) = Replace(Cells(1, 1), "p", "q")
    Cells(2, 3) = Replace(Cells(1, 1), "p", "P", 7)
    Cells(3, 1) = StrConv(Cells(1, 1), 1)
    Cells(3, 2) = StrConv(Cells(1, 1), 2)
    Cells(3, 3) = StrConv(Cells(1, 1), 3)
    Cells(3, 4) = StrConv(Cells(1, 1), 4)
    Cells(4, 1) = InStr(Cells(1, 1), "pie!")
    Cells(4, 2) = IsDate(Cells(1, 1))
    Cells(4, 3) = IsNumeric(Cells(1, 1))
    Cells(5, 1) = Date
    Cells(5, 2) = DateAdd("d", 10, Cells(5, 1))
    Cells(5, 3) = DateDiff("d", Cells(5, 1), Cells(5, 2))
    Cells(5, 4) = DateSerial(2024, 4, 1)
    Cells(6, 1) = Year(Date)
    Cells(6, 2) = Month(Date)
    Cells(6, 3) = Day(Date)
    Cells(6, 4) = Format(Cells(5, 4), "yyyy年mm月dd日")
    Cells(7, 1) = InputBox("入力")
    MsgBox (Cells(7, 1))
End Sub
```

