# PowerAutomate

アプリとサービス間の自動化されたワークフローを作成するツール。クラウドフロー（クラウド上で完結する）、デスクトップフロー（デスクトップ上での操作を自動化する）、ビジネスプロセスフロー（一連のビジネスプロセスの実行を標準化する）を作成可能。
作成したフローを自動起動、Webやモバイルアプリから起動可能。

## 気づいたこと（雑多なメモ）

#### TryCatch内で変数の宣言ができない

☆TryCatchは「Control」の「スコープ」から設定可能。  
SharePointから「複数項目の取得」を設定「ForEach」が自動生成され、
Forが量産されていた時に、後ろの処理の回数を制限したいので変数を宣言していたら発生した。

TryCatchの外、トリガーの下あたりで宣言して事なきを得た。

#### フィルタークエリで値には''が必要

動的な値を設定した時でも''を忘れているとエラーを吐くので注意。
**フィルタークエリに限らず、ちょこちょこ''が要求される。**