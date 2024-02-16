# Django

Djangoは変転の激しい環境で開発された経緯から、Web開発タスクを迅速かつ簡略化するように設計されている、Pythonのフレームワーク。

---

## 目次<a id=init></a>

[導入](#install)
[プロジェクト作成](#new_project)
[開発サーバーの動作](#move_server)
[アプリ作成](#new_app)
[モデル](#model)
[API](#api)
[Django Admin](#admin)
[View](#view)
[フォーム](#form)
[自動テスト](#auto_test)
---

## 導入<a id=install></a>

Djangoのインストールには三通り。

- オフィシャルリリースのインストール（恐らく普通の方法）
- OSのディストリビューションで提供されているバージョンのインストール？？？
- 最新の開発版のインストール（バグが多い。　最新の機能を使える）

### 前提

- pythonインストール
- データベースの設定（規模的に必要なら）

### 通常のインストール手順

インストールしたいフォルダをカレントに変更してから行うこと。

venv環境作成
```bash
python -m venv mydjango 
```
Djangoインストール
```command
mydjango\scripts\activate
pip install django
```
バージョン確認
```shell python
import django
print(django.get_version())
```
こっちでも良い
```shell
python -m django --version
```

[目次](#init)

---

## プロジェクト作成<a id=new_project></a>

プロジェクトの作成方法は以下。最初のセットアップとしてプロジェクトを構成するコードを自動生成する。

```bash
django-admin startproject mysite
```

プロジェクト名にはdjangoやtest等、衝突を避けるためPythonモジュールやDjangoのコンポーネント名を使用しないよう気を付ける必要がある。

コードはWebサーバのドキュメントルート下に置かないこと。Webを介して利用者が読めるようになってしまうため。
要するに、上記コードで作成したプロジェクトをドキュメントルート外に配置しておけば良い。Webサーバーの設定の方でDjangoプロジェクト経由でアクセスするように設定すれば良い。

作成されたファイルは以下。

```
mysite/
    manage.py
    mysite/
        __init__.py
        setting.py
        urls.py
        asgi.py
        wsgi.py
```

- 最外mysite/ルートディレクトリはプロジェクトのコンテナ。任意の名前可。
- manage.pyはDjangoプロジェクトに対する様々な操作を行うためのコマンドラインユーティリティ。
- 内側mysite/ディレクトリはプロジェクトのPythonパッケージ。importの際使用するのはこの名前になる。
- mysite/__init__.pyはディレクトリがPythonパッケージであるとPythonに知らせるための空ファイル。
- mysite/setting.pyはDjangoプロジェクトの設定ファイル。
- mysite/urls.pyはプロジェクトのURL宣言。Djangoサイトにおける目次。
- mysite/asgi.pyはプロジェクトを提供するASGI互換Webサーバーのエントリーポイント。
- mysite/wsgi.pyはプロジェクトをサーブするためのWSGI互換Webサーバーとのエントリーポイント。

☆ASGIは非同期処理をサポートするWebサーバーのインターフェース。非同期処理を必要とするフレームワークやアプリを実行するために使用する。
☆WSGIは、Python WebアプリケーションとWebサーバー間のインターフェースを定義したもの。

[目次](#init)

---

## 開発サーバーの動作<a id=move_server></a>

プロジェクトディレクトリに移動後、実行。

```bash
python manage.py runserver
```

"http://localhost:8000/"で開発用のページが確認できるはず。

[目次](#init)

---

## アプリ作成<a id=new_app></a>

プロジェクトを作成すれば、自分用の環境が立ち上がり、作業にとりかかる準備ができた、ということになる。

Django内に追加する各アプリケーションは所定の規約に従ったPythonパッケージで構成されている。基本的なディレクトリ構造を自動作成するユーティリティが含まれているため、ディレクトリの作成は必要ない。

アプリはPythonパス上のどこでも置くことができる。サブモジュールではなく、トップレベルモジュールとする場合は、manage.pyと同じディレクトリにアプリを作成。

```bash
python manage.py startapp polls
```

作成されたファイルは以下。

```
polls/
    __init__.py
    admin.py
    apps.py
    migrations/
        __init__.py
    models.py
    tests.py
    views.py
```

views.pyを編集して、最初のViewを設定してみる。

```py
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```

簡単なViewであるものの、呼び出しのためにURLは対応付けをする必要がある。そのため、URLconfが必要である。

pollsディレクトリ内にurls.pyを追加。ファイル内には、以下のコードを記述。

```py
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```

そして、ルートのURLconfにpolls.urlsモジュールの記述を反映する。追加する記述はdjango.urls.includeのimport、またurlpatternsにinclude()を挿入。

```py
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("polls/", include("polls.urls")),
    path("admin/", admin.site.urls),
]
```

### include()

include()は他URLconfへの参照。Djangoがinclude()に遭遇すると
、一致したURLの部分を切り落として次の処理のため、残りの文字列をincludeされたURLconfへ渡す。

☆URLパターンをincludeするならいつでもinclude()の形で使用するべき。例外はadmin.site.urlsのみ。

### path()
また、path()関数は引数を四つ受け取る。そのうちrouteとviewは必須であり、kwargsとnameは省略可能。

#### 引数route

URLパターンを含む文字列。
リクエスト処理にはurlpatternsのはじめの項目から開始してリストを順に下に向かって確認する。要求されたURLと一致するものを見つけるまで比較を続ける。パターンはGET、POST
POSTなどのパラメータ、ドメイン名を検索しない。どうパラメータをURLに含んでも元のパターンを確認する。

#### 引数view

一致するものを発見後、指定されているViewを呼び出す。HttpRequestオブジェクトを第一引数、キーワード引数としてrouteからキャプチャされた値を呼び出す。

#### 引数kwargs

任意のキーワード引数を辞書として対象のビューに渡す。

#### 引数name

URLに名前付けをしておくことで、Djangoのどこでも参照できる。テンプレートの中が有効である。プロジェクトのURLにグローバルな変更を加える場合、一つのファイルを変更するだけで済むようになる。

[目次](#init)

---

## Databaseの設定<a id=setting_db></a>

mysite/settings.py : Djangoの設定を表現するモジュールレベルの変数を持つ通常のPythonモジュール。

デフォルトならばSQLiteを使用することになる。単にDjangoを試すだけならば最も簡単な選択となる。SQLiteはPythonに標準で組み込まれている。
☆本番環境で使用するならスケーラブルなDBを使用する方が当然良い。

他DBを使用する場合、適切なDBのバインディングをインストールして、設定ファイルのDATAVASESの'default'項目内の以下のキーをDBの接続設定に合うように変更するべき。

- ENGINE
    'django.db.backends.sqlite3'
    'django.db.backendspostgresql'
    'django.db.backends.mysql'
    'django.db.backends.oracle'
    のいずれかにする必要がある。その他バックエンドも利用可。
- NAME
    DBのNAME。SQLiteを使用している場合はDBはコンピュータ上のファイルになる。デフォルトのBASE_DIR／'db.sqlite3'はプロジェクトディレクトリにファイルを保存する。

SQlite以外を使っている場合は、USER、PASSWORD、HOST等の設定を加える必要がある。DBの作成は以下、DBのインタラクティブプロンプトで実行する。

```prompt
CREATE DATABASE database_name;
```

mysite/settings.pyの編集時にはTIME_ZONEに自分のタイムゾーンを設定する。ファイル先頭になるINSTALLED＿APPSに注意するべき。Djangoインスタンスの中の有効されている全てのDjangoアプリの名前を保持している。

アプリは複数のプロジェクトで使用でき、他の開発者が使用できるようにパッケージして配布することもできる。

デフォルトでは、INSTALLED_APPSには以下のアプリが含まれる。

- django.contrib.admin : 管理サイト。
- django.contrib.auth : 認証システム。
- django.contrib.contenttypes : コンテンツタイプフレームワーク。
- django.contrib.sessions : セッションフレームワーク
- django.contrib.messages : メッセージフレームワーク
- django.contrib.staticfiles : 静的ファイルの管理フレームワーク

アプリでは最低一つのDBテーブルが必要なので、使用前にDBにテーブルを作成する。コマンドは以下。

```bash
py manage.py migrate
```

migrateコマンドはINSTALLED_APPSの設定を参照、mysite/settings.pyファイルのDB設定に従って必要な全てのDBのテーブルを作成する。DBmigrationはアプリと共に配布できる。また、実行する度メッセージを見ることになる。

作成されたテーブルを確認するには以下のコード。（アプリ内、manage.pyがあるディレクトリに移動してから）

```bash
python manage.py dbshell
.table
```

☆パスのエラーが出る際は、SQLiteのパス指定がうまくいっていない可能性があるので、以下の手順を試すべき。

- "C:\Users\akio-horikawa\Desktop\git\Zatta_Matome\mydjango\sqlite-tools-win-x64-3450100" からsqlite-tools-win...のbundle of commnad-line tools版をダウンロード。
- 解凍したフォルダをわかりやすい位置に移動してパスをコピー。
- システム詳細設定から環境変数の編集、PATHをダブルクリックして新規でコピーしてきたパスを登録。
- VSCodeでやっているなら、再起させてコマンドを試してみる。

[目次](#init)

---

## モデル<a id=model></a>

モデルとは、手持ちのデータに対する唯一無二の決定的なソースのこと。格納したいデータにとって必要不可欠なフィールドと、そのデータの挙動を格納する。Djangoのモデルの目的は、一つの場所でデータモデルを定義して、そこから自動的にデータを取得すること。

### モデルの作成

QuestionとChoiceの二つのモデルを作成してみる。Pollにはquestionとpublication dateの情報があり、Choiceには選択肢のテキストとvoteという二つのフィールドを含む。各Choiceは一つのQuestionに関連付けられる。

polls/models.py

```python
from django.db import models

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
```

- 各モデルは一つのクラスで表現されており、django.db.models.Modelのサブクラス。各モデルには複数のクラス変数が存在し、個々のクラス変数はモデルのDBフィールドを表現する。
- 各フィールドはFieldクラスのインスタンスとして表現されている。☆CharFieldなら文字フィールド、DateTimeFieldなら日時フィールド。
- Fieldインスタンスの名前は機械可読なフィールド名であり、コード上、DB上でも列として使用する。
- Fieldの最初の位置引数にはオプションとして人間可読なフィールド名を指定できる。Djangoの二つの内省機能で使用する他、ドキュメントとしての役割も果たす。指定しなければ機械可読な名前を使用する。
- Fieldクラスの中には必須の引数を持つものがある。CharFieldにはmax_lengthを指定する必要がある。
- Fieldはオプションの引数も取得できる。

### モデルの有効化

僅かなコードでDjangoが多くの情報を知ることができる。

- アプリのDBスキーマを作成（CREATE TABLE）
- PythonからアクセスするためのDBAPIを作成

しかしながら、以上のことをする前に、pollsアプリをインストール済みとプロジェクトに認識させる必要がある。

アプリをプロジェクトに含めるには構成クラスへの参照をINSTALLED_APPS設定に追加する必要がある。PollsConfigはpolls/apps.pyにあるため、ドット繋ぎのパスはpolls.apps.PollsConfigとなる。mysite/setting.pyを編集してINSTALLED_APPS設定にパスを追加する。

そうすることで、Djangoがpollsアプリを含むことを認識できる。そして以下のコマンドを実行すると、Djangoにモデルの変更を伝え、migrationの形で変更を保存できる。

`py manage.py makemigrations polls`

コマンドの結果として以下。

```bash
Migrations for 'polls':
  polls\migrations\0001_initial.py
    - Create model Question        
    - Create model Choice
```

#### migration

Djangoがモデルの変更を保存する方法。ディスク上ではただのファイル。新しいモデルのためにmigrationファイルを読み込むこともできるが、ファイル作成時に一々読み込む処理が必要なわけではない。また、手動で微調整できるように人間可読可能なファイルとなっている。

Djangoにはmigrationによって自動でDBスキーマを管理するコマンド、migrateコマンドが存在する。先にmigrationによって実行されるSQLを確認する。コマンドはsqlmigrateで以下。

```bash
python manage.py sqlmigrate polls 0001
```

返される結果、migrationの名前を引数にとったSQLが以下。

```bash
BEGIN;
--
-- Create model Question
--
CREATE TABLE "polls_question" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, 
    "question_text" varchar(200) NOT NULL, 
    "pub_date" datetime NOT NULL
);
--
-- Create model Choice
--
CREATE TABLE "polls_choice" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, 
    "choice_text" varchar(200) NOT NULL,
    "votes" integer NOT NULL,
    "question_id" bigint NOT NULL REFERENCES "polls_question" ("id")
    DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX "polls_choice_question_id_c5b4b260" ON "polls_choice" ("question_id");

COMMIT;
```

この結果に関しては以下。

- 出力結果は使用しているDBによって異なる
- テーブル名はアプリ名とモデルの小文字表記の組み合わせで自動生成
- プライマリキーは自動で追加
- 便宜上、外部気フィールドに_idを追加
- 外部キーのリレーションシップはFOREIGN KEY制約で明確化され、外部キーをトランザクション終了まで強制しないようにDEFERRABLEの部分で設定
- 使用しているDBに合わせて、integer NOT NULL PRIMARY KEY AUTOINCREMENTのように適した型を自動で選択、生成する
- sqlmigrateコマンドは実際にDBにmigrationを実行するのではなく、Djangoが必要とするSQLを表示するのみ

`python manage.py check` を実行すればDBに触れず、問題が無いか確認することができる。

migrateコマンドによって適用されていないmigrationを認識、DBに対してそれを実行する。モデルに対して行った変更がスキーマと同期する。☆DjangoはDB内にdjango_migrationsという特別なテーブルを利用して適用状態を追跡している。

```bash
$ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, polls, sessions
Running migrations:
  Applying polls.0001_initial... OK
```

上記はmigrateの実行結果。

migrationは強力な機能で、プロジェクトの発展に合わせてモデルを更新し続けることが可能。DBやテーブルを新しく作り変えるような必要はなく、データを失うこともなくライブで更新することに特化している。モデル変更のチャートは以下。

- モデル変更（models.py）
- 変更のためmigrationを生成（python manage.py makemigrations）
- DBへ変更を適用（python manage.py migrate）

migrationの作成、適用の処理が分けられている理由として、バージョン管理システムにコミットすることでアプリとして配布が可能になることが挙げられる。

[目次](#init)

---

## API<a id=api></a>

APIを試す為、Python対話シェルを起動、以下のコマンドを実行。

```bash
python manage.py shell
```

manage.pyでDJANGO_SETTINGS_MODULE環境変数を設定しているため、pythonに加えて起動設定をしている。
シェルでの操作ログは以下。

```python
>>> from polls.models import Choice, Question

>>> Question.objects.all()
<QuerySet []>

>>> from django.utils import timezone
>>> q = Question(question_text="What's new?", pub_date=timezone.now())

>>> q.save()

>>> q.id
1

>>> q.question_text
"What's new?"
>>> q.pub_date
datetime.datetime(2024, 2, 7, 1, 14, 14, 846852, tzinfo=datetime.timezone.utc)

>>> q.question_text
"What's new?"
>>> q.save()

>>> Question.objects.all()
<QuerySet [<Question: Question object (1)>]>
```

`<QuerySet [<Question: Question object (1)>]>` はオブジェクトの表現として全く役に立たない。
polls/models.py内のQuestionモデルを編集し、修正する必要がある。
`__str__()` メソッドを両モデルに追加する、コードは以下。

```python
from django.db import models

class Question(models.Model):
    #...
    def __str__(self):
        return self.question_text

class Choice(models.Model):
    #...
    def __str__(self):
        return self.choice_text
```

シェルでの表示の利便性だけでなく、Djangoの自動生成adminでオブジェクトの表現として使用されるため、 `__str__()` メソッドをモデルに追加する事が重要。
モデルクラスにクラスメソッドを追加する、コードは以下。

```python
import datetime

from django.db import models
from django.utils import timezone

class Question(models.Model):
    #...
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
```

Pythonの標準モジュールdatetimeとDjangoのタイムゾーン関連ユーティリティのdjango.utils.timezoneを参照している。

変更を保存し、再度シェルで操作を行う。ログは以下。

```python
>>> from polls.models import Choice, Question

>>> Question.objects.all()
<QuerySet [<Question: What's new?>]>

>>> Question.objects.filter(id=1)
<QuerySet [<Question: What's new?>]>
>>> Question.objects.filter(question_text__startswith="What")
<QuerySet [<Question: What's new?>]>

>>> from django.utils import timezone
>>> current_year = timezone.now().year
>>> Question.objects.get(pub_date__year=current_year)
<Question: What's new?>

>>> Question.objects.get(id=2)
Traceback (most recent call last):
    ...
DoesNotExist: Question matching query does not exist.

>>> Question.objects.get(pk=1)                        
<Question: What's new?>

>>> q = Question.objects.get(pk=1)
>>> q.was_published_recently()
True

>>> q = Question.objects.get(pk=1)

>>> q.choice_set.all()
<QuerySet []>

>>> q.choice_set.create(choice_text="Not much", votes=0)
<Choice: Not much>
>>> q.choice_set.create(choice_text="The sky", votes=0)  
<Choice: The sky>
>>> c = q.choice_set.create(choice_text="Just hacking again", votes=0)

>>> c.question
<Question: What's new?>

>>> q.choice_set.all()
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>
>>> q.choice_set.count()
3

>>> Choice.objects.filter(question__pub_date__year=current_year)
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>

>>> c = q.choice_set.filter(choice_text__startswith="Just hacking")
>>> c.delete()
(1, {'polls.Choice': 1})
```

[目次](#init)

---

## Django Admin<a id=admin></a>

### 管理者ユーザーの作成

作成コマンドは以下。

```bash
$ py manage.py createsuperuser
Username (leave blank to use 'akio-horikawa'): admin
Email address: admin@exam.com
Password: 
Password (again):
Superuser created successfully.
```

### 開発サーバーの起動

サーバーの起動は以下コマンド。

```bash
$ py manage.py runserver
```

アクセスするページは `http://127.0.0.8000/admin/` 。
デフォルトでtranslationが有効なので、LANGAGE_CODEを設定すれば与えられた言語でログイン画面が表示される。

前のステップで作成したスーパーユーザーでログイン、Django Adminのインデックスページが表示される。
既に幾つかの項目が存在、それらはDjangoに含まれる認証フレームワークのdjango.contrib.authによって提供されている。

### admin上でのPollアプリの編集

Pollsアプリは初期状態では表示されていない。
Questionオブジェクトがadminにインターフェースを持つことを認識させる必要があるため。
polls/admin.pyを編集、コードは以下。

```python
from django.contrib import admin

from .models import Question

admin.site.register(Question)
```

admin画面を再読み込みすればQuestionの項目が増えているはず。

Questionをクリックして、作成してある"What's new?"を開けば、編集フォームが表示されるはず。
☆このフォームはmodels.pyのQuestionモデルから生成されている。後から追加した `__str__` などがそれにあたる。

それ以外の注意点については以下。

- modelのフィールドの型はDateTimeField、CharField等はそれぞれ異なるHTML入力ウィジェットと対応、各種フィールドはそれぞれがDjango adminサイトでどう表示されるかを自身で判断できる
- DateTimeFieldはJavaScriptショートカットが存在する。
  - 日付datesのカラムには本日todayのショートカットと、カレンダーポップアップボタンがある。
  - 時刻timesには現在nowへのショートカットと、入力される時刻のリストを表示するポップアップボタンがある。

ページ末尾に追加される操作ボタンについては以下。

- 保存saveボタン、変更を保存してリストへ戻る
- 保存して編集を続けるsave and continue editingボタン、変更を保存し、オブジェクト編集ページをリロードする
- 保存してもう一つ追加save and add anotherボタン、変更を保存し、同じモデルのオブジェクトを新規追加する空の編集ページをロードする
- 削除deleteボタン、削除確認ページを表示する

また、編集を加えて保存、画面右上に表示される履歴historyをクリックすればユーザーが行った変更履歴の全てを変更時刻と変更を行ったユーザー名付きでリストアップしたページを表示する。

[目次](#init)

---

## View<a id=view></a>

Viewとは、Djangoのアプリにおいて特定の機能を提供するページ型であり、各々のテンプレートを持っている。
一般的なブログアプリなら以下のようなビューが望ましい。

- ホームページ、最新エントリーを表示
- エントリー詳細ページ、1エントリーへ対する固定リンクページ
- 年ごとのアーカイブページ、指定された年のエントリーの月を全て表示
- 月ごとのアーカイブページ、指定された月のエントリーの日を全て表示
- 日ごとのアーカイブページ、指定された日のエントリーを全て表示
- コメント投稿、エントリーに対するコメントの投稿を受け付け

Djangoではページとコンテンツはビューによって提供される。各ビューは単純なPython関数として実装されている。DjangoはビューをリクエストされたURLから決定する。DjangoにおけるURLパターンはURLを単に一般化したもの。URLからビューを得るためにはDjangoはURLconfと呼ばれるものを使用、URLconfはURLパターンをビューにマッピングする。

### Viewの追加

Viewの追加のため、polls/views.pyを編集する。コードは以下。

```python
def detail(request, question_id):
    return HttpResponse("You're looking at question %s." % question_id)

def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)

def vote(request, question_id):
    return HttpResponse("You're voting on question %s." % question_id)
```

次のpath()コールを追加して、新たなviewをpolls.urlsモジュールと結びつける。

```python
urlpatterns = [
    # ...
    # ex: /polls/5/
    path("<int:question_id>/", views.detail, name="detail"),
    # ex: /polls/5/results/
    path("<int:question_id>/results/", views.results, name="results"),
    # ex: /polls/5/vote/
    path("<int:question_id>/vote/", views.vote, name="vote"),
]
```

各ビューには役割が二つあり、一つはリクエストされたページのコンテンツを含むHttpResponseオブジェクトを返す、もう一つはHttp404等の例外送出。それ以外の処理はユーザー次第。

ビューはDBからレコードを読みだしても、読みださなくてもよい。Djangoのテンプレシステム、あるいはサードパーティのPythonテンプレシステムを使用してもよい。Pythonライブラリを使用してやりたいことを何でも実現できる。

とにかく、Djangoに重要なのはHttpResponseか、例外か。

DjangoのDBAPIを使ってみる。試しにindex()ビューを作成、コードは以下。

```python
from django.http import HttpResponse

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by("-pub_date#")[:5]
    output = ", ".join([q.question_text for q in latest_question_list])
    return HttpResponse(output)
```

上記のコードは問題がある。ページデザインがハードコードされているため、ページの見栄えを変更するたびにPythonコードの更新が必要。Djangoのテンプレシステムを使って、Viewから使用できるテンプレを作成してPythonからデザインを分離するべき。

polls内にtemplatesディレクトリを作成、その中にindex.htmlを作成する。これがテンプレとなる。コードは以下。

```html
{% if latest_question_list %}
    <ul>
    {% for question in latest_question_list %}
        <li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No polls are available.</p>
{% endif %}
```

テンプレを使用するためには、polls/views.pyのindexビューを更新しなくてはならない。
コードは以下。

```python
from django.http import HttpResponse
from django.template import loader

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by("-pub_date#")[:5]
    template = loader.get_template("polls/index.html")
    context = {
        "latest_question_list": latest_question_list,
    }
    return HttpResponse(template.render(context, request))
```

上記コードでpolls/index.htmlというテンプレをロードして、そこにコンテクストを渡す。

### ショートカット：render()

テンプレをロード、コンテクストに値を入れて、テンプレをレンダリングした結果をHttpResponseオブジェクトで返す、というイディオムは頻繁に使用される。Djangoはこれに対するショートカットが用意されている。コードは以下。

```python
from django.shortcuts import render

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by("-pub_date#")[:5]
    context = {"latest_question_list": latest_question_list}
    return render(request, "polls/index.html", context)
```

Viewをこのような形にすればimportする物を減らすことができる。

render()関数は、第一引数としてrequestオブジェクトを第二引数としてテンプレ名を、第三引数として辞書を受け取る。この関数はテンプレを指定のコンテクストでレンダリングし、そのHttpResponseオブジェクトを返す。

### 404エラーの送出

質問詳細ビューに関して、コードは以下に。

```python
from django.http import Http404
from django.shortcuts import render

from .models import Question


# ...
def detail(request, question_id):
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return render(request, "polls/detail.html", {"question": question})
```

上記コード内で、リクエストIDに対する質問が存在しない場合、Http404を送出する。polls/detail.htmlテンプレには別の記述をする必要があるが、とりあえずは以下。

```html
{{ question }}
```

### ショートカット：get_object_or_404()

get()を実行してオブジェクトが存在しない場合にはHttp404を送出する、頻繁に使用されるイディオム。Djangoにはこれに対するショートカットが用意されている。

ショートカットを使用してdetail()ビューを書き換える。コードは以下。

```python
from django.shortcuts import get_object_or_404, render

from .models import Question

def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, "polls/detail.html", {"question": question})
```

get_object_or_404()関数は、Djangoモデルを第一引数、任意の数のキーワード引数を取り、モデルのマネージャのget()関数に渡す。オブジェクトが存在しない場合はHttp404を発生させる。

☆get_list_or_404()という関数もあり、get_object_or_404()と同じように動作するがget()ではなく、filter()を使用する。リストが空の場合はHttp404を送出する。

### テンプレートシステムの使用

detail()ビューのコンテクスト変数をquestionとするとpolls/detail.htmlテンプレは以下。これによってquestionの名前が大きく表示、その下に選択肢がforで繰り返してリストアップされる。

```html
<h1>{{ question.question_text }}</h1>
<ul>
{% for choice in question.choice_set.all %}
    <li>{{ choice.choice_text }}</li>
{% endfor %}
</ul>
```

テンプレートシステムは変数の属性にアクセスするためにドット検索の構文を使用。{{question.question_text}}を例にするとDjangoはquestionオブジェクトに辞書検索を行い、次に属性検索、それに失敗すればリストインデックスでの検索を行う。

メソッドの呼び出しは{% for %}ループ内で行われ、question.choice_set.allはPythonコードのquestion.choice_set.all()と解釈される。結果、Choiceオブジェクトからイテレーション可能オブジェクトを返し、{% for %}タグで使用可能に。

#### テンプレ内ハードコードURL削除

最初にpolls/index.htmlテンプレートで質問へのリンクを書いたとき、リンクの一部は以下のようにハードコードされている。

`<li><a href="/polls/{{question.id}}/">{{question.question_text}}</a></li>`

こういったコードの問題点はテンプレートが多数あるプロジェクトでURLの変更が難化することにある。polls.urlsモジュールのpath()関数でname引数を定義したために、{%url%}テンプレートタグを使用することでurl設定で定義された特定のURLパスへの依存を削除できる。

`<li><a href="{% url 'detail' question.id %}">{{question.question_text}}</a></li>`

polls.urlsモジュールに指定されたURLの定義を検索するため、これは正しく機能する。'detail'のURL名は以下で定義。

```python
...
path("<int:question_id>/", views.detail, name="detail"),
...
```

これをpolls/1/等以外の他のものを使用したい場合は、例えるならばpolls/specifics/12/のようにしたければ以下。対象となるテンプレを変更せず、polls/urls.pyを変更する。

```python
...
path("specifics/<int:question_id>/", views.detail, name="detail"),
...
```

### URL名の名前空間

アプリが無数に存在するDjangoプロジェクトではアプリ間でどうやってURL名を区別するのか、detailビューが他アプリにも存在した場合、{% url %}のようにテンプレートタグを使用した時、Djangoはどのアプリのビューを生成するのか。

URLconfに名前空間を追加する事で、この問題を解決することが出来る。polls/urls.pyのコードは以下。

```python
from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    # ex: /polls/
    path("", views.index, name="index"),
    # ex: /polls/5/
    path("<int:question_id>/", views.detail, name="detail"),
    # ex: /polls/5/results/
    path("<int:question_id>/results/", views.results, name="results"),
    # ex: /polls/5/vote/
    path("<int:question_id>/vote/", views.vote, name="vote"),
]
```

そして、対応させるためにpolls/index.htmlを編集する。

```html
<li><a href="{{% url 'detail' question.id %}}/">{{ question.question_text }}</a></li>
```
```html
<li><a href="{{% url 'polls:detail' question.id %}}/">{{ question.question_text }}</a></li>
```

前者が編集前、後者が編集後。pollsという名前空間つきの詳細ビューを指すように設定できる。

[目次](#init)

---

## フォーム<a id=form></a>

polls/detail.htmlを更新してHTMLの<form>要素を追加する。コードは以下。

```html
<form action="{% url 'polls:vote' question.id %}" method="post">
    {% csrf_token %}
    <fieldset>
        <legend><h1>{{ question.question_text }}</h1></legend>
        {% if error_message %}<p><strong>{{ error_message }}</strong></p>{% endif %}
        {% for choice in question.choice_set.all %}
            <input type="radio" name="choice" id="choice{{ forloop.counter }}" value="{{ choice.id }}">
            <label for="choice{{ forloop.counter }}">{{ choice.choice_text }}</label><br>
        {% endfor %}
    </fieldset>
    <input type="submit" value="Vote">
</form>
```

- 上記コードにより、質問に対する選択肢にラジオボタンが追加される。各ラジオボタンのvalueは関連する質問の選択肢のID、nameはchoiceである。つまりはラジオボタンを選択、フォームを送信することで、POSTデータchoice = #(#は選択したID)が送信される。
- フォームのactionを{% url 'polls:vote' question.id %}に設定し、method="post"を設定。フォームの送信により、サーバ側データ更新に繋がるため、method="get"ではなく、method="post"を使用することは重要。 サーバ側のデータ更新を行うフォームを作成する場合はmethod="post"を使用するべき。これはDjangoに限った話ではない。
- forloop.counterはforタグのループが何度実行されたか表す値。
- データ改ざんの恐れがある、POSTフォームを作成しているのでクロスサイトリクエストフォージェリを気にする必要がある。しかし、Djangpにはこれに対する仕組みが用意されているため、心配の必要はない。自サイト内をURLに指定したPOSTフォームにはすべて{% csrf_token %}テンプレートタグを使うべき。

送信されたデータを処理するためのDjangoのビューを作成する。コードは以下。

```python
...
path("<int:question_id>/vote/", views.vote, name="vote"),
...
```

これは少し前に記述したpolls/urls.pyのvote部分、変更はなし。
polls/views.pyに本来の記述を追加して実装する。

```python
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from .models import Choice, Question

#...
def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))
```

- request.POSTは辞書のようなオブジェクト、キーを指定することで送信したデータにアクセスできる。この場合はrequest.POST['choice']は、選択された選択肢のIDを文字列として返す。request.POSTの値は常に文字列である。

☆Djangoでは同じ方法でGETデータにアクセスするために、request.GETを用意している。しかし、POST呼び出し以外でデータを更新しないようにするため、request.POSTを明示的に使用。

- POSTデータにchoiceが無ければ、request.POST['choice']はKeyErrorを送出、上のコードではKeyErrorをチェックしてchoiceが無ければエラー付き質問フォームを再表示。
- choiceのカウントをインクリメントした後、このコードは通常のHttpResponseではなくHttpResponseRedirectを返し、HttpResponseRedirectは一つの引数をとる。
- 上記コードでは、HttpResponseRedirectコンストラクタの中でreverse()関数を使用。この関数を使用することで、ビュー関数でのURLのハードコードを防げる。関数には制御を渡したいビューの名前と、そのビューに与えるURLパターンの位置引数を与えるべき。

質問に対する回答を投票した後、vote()ビューは質問の結果ページにリダイレクトする。そのビューのコードが以下。

polls/views.py
```python
from django.shortcuts import get_object_ore_404, render

def results(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, "polls/results.html", {"question": question})
```

polls/results.html
```html
<h1>{{ question.question_text }}</h1>

<ul>
{% for choice in question.choice_set.all %}
    <li>{{ choice.choice_text }} -- {{ choice.votes }} vote{{ choice.votes|pluralize }}</li>
{% endfor %}
</ul>

<a href="{% url 'polls:detail' question.id %}">Vote again?</a>
```

ブラウザで質問に回答すると、結果のページに遷移し、更新が入るはず。選択肢を選ばないとエラーが出力される。

### 汎用View

ここまでに記述したコードの内容、detail()、results()、index()ビューは簡単なものながら、冗長。

上記ビューはWeb開発の一般的なケースであり、（URLを介して渡されたパラメータに従い、DBからデータを取り出してテンプレートをロード、レンダリングしたテンプレートを返す）Djangoではこれに関する汎用ビューというショートカットを用意している。

汎用ビューは一般的パターンを抽象化し、Pythonコード無しでアプリを実装できるようにしている。ListViewとDetailViewはそれぞれ"オブジェクトの一覧を表示"、"特定のオブジェクトの詳細ページを表示"という概念の抽象化。

汎用ビューシステムへの変換のステップは以下。

- URLconfを変換
- 古い不要なビューを削除
- 新しいビューにDjangoの汎用ビューを設定

#### 修正

##### URFconfの修正

polls/utls.pyに変更を加える。コードは以下。

```python
from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("<int:question_id>/vote/", views.vote, name="vote"),
]
```

detail、resultsのパターンのパス文字列に一致するパターン名が<question_id>から<pk>に変更されている。後にDetailViewという汎用ビューを使用し、detail()とresults()ビューを置き換えるため、URLから取得したプライマリキーの値をpkとして扱うため。

##### viewsの修正

index、detail、resultsのビューを削除して代わりの汎用ビューを使用するようにpolls/views.pyを編集する。

```python
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic

from .models import Choice, Question

class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by("-pub_date")[:5]

class DetailView(generic.DetailView):
    model = Question
    template_name = "polls/detail.html"

class ResultsView(generic.DetailView):
    model = Question
    template_name = "polls/results.html"

def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected_choice.votes += 1
        selected_choice.save()
        return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))
```

汎用ビューはどのモデルに対して動作するか認識させる設定が必要であるため、model属性を指定するか、get_queryset()関数を定義する。

デフォルトではDetailView汎用ビューは `<app name>/<model name>_detail.html` というテンプレートを使用する。テンプレート名は"polls/question_detail.html"となる。template_name属性を指定することで自動生成された名前でなく、指定した名前を設定できるようにDjangoに命令できる。resultsリストビューにtemplate_nameを指定、これにより結果ビューと詳細ビューをレンダリングした時に違った見た目になる。

これまででは、questionやlatest_question_listといったコンテクスト変数が含まれるコンテクストをテンプレートに渡している。DetailViewにはquestion変数が自動で渡されていた。

ListViewでは自動的に生成されるコンテクスト変数はquestion_listになる。上書きするにはcontext_object_name属性を与え、ここでlatest_question_listを代わりに指定する。

代替案としてはテンプレートのほうを変更し、新しいデフォルトのコンテクスト変数の名前を一致させることもできる。

より簡単な方法としては使用したい変数名をDjangoに伝えるのみのほうが良い。

[目次](#init)

---

## 自動テスト<a id=auto_test></a>

テストは異なるレベルで実行される。
小さな機能に対して行われることあれば、ソフトウェア全体の動作に対して行うこともある。こうしたテストは、実際にアプリを実行してメソッドの動作を確認したり、値を入力した結果がどうなるか確認することと違いはない。

自動テストにおいてはテスト作業がシステムによって行われる。テストセットを設定しておけばアプリに変更を加える度、テストが実行される。つまり、手動でテストをする必要はない。

### テスト作成

現在のpollsアプリには修正可能なバグが存在している。

☆question.was_published_recently()メソッドがQuestionが昨日以降に作成された場合にTrueを返す。それに加えてQuestionのpub_dateが未来の日時でもTrueを返してしまう。

shellでもバクを確認できる。コマンドは以下。

```bash
$ python manage.py shell

>>> import datetime
>>> from django.utils import timezone
>>> from polls.models import Question
>>> huture_question = Question(pub_date=timezone.now() + datetime.timedelta(days=30))
>>> huture_question.was_published_recently()
True
```

☆Trueと出てはいけない。

上記で行ったテストを自動で行いたいので、polls/tests.pyにテストを記述する。コードは以下。

```python
import datetime

from django.test import TestCase
from django.utils import timezone

from .models import Question

class QuestionModelTests(TestCase):
    def test_was_published_recently_with_future_question(self):
        time = timezone.now() + datetime.timedelta(days=30)
        future_question = Question(pub_date=time)
        self.assertIs(future_question.was_published_recently(),
        False)
```

テストの実行には以下コマンド。

```bash
python manage.py test polls
```

結果は以下。

```bash
Found 1 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
F
======================================================================
FAIL: test_was_published_recently_with_future_question (polls.tests.QuestionModelTests.test_was_published_recently_with_future_question)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\akio-horikawa\Desktop\git\Zatta_Matome\mydjango\mysite\polls\tests.py", line 12, in test_was_published_recently_with_future_question
    self.assertIs(future_question.was_published_recently(),
AssertionError: True is not False

----------------------------------------------------------------------
Ran 1 test in 0.002s

FAILED (failures=1)
Destroying test database for alias 'default'...
```

ここまでの自動テストに関するまとめは以下。

- manage.py test polls はpollsアプリ内にあるテストを探索
- django.test.TestCase クラスのサブクラスを発見
- テストのためのDBを作成、テスト用メソッドとしてtestで始まるメソッドを探索
- test_was_published_recently_with_future_questionの中でpub_dateフィールドに本日から30日後の日付を持つQuestionインスタンスを作成する設定
- そして最後にassertIs()メソッドを使用することで返ってくる値はFalseではなく、was_published_recently()がTrueを返すことを発見

テストの失敗だけでなく、失敗した行数まで出力されている。

### バグ修正

今回のバグは原因がわかっているのでQuestion.was_published_recently()はpub_dateが未来の日付である時にFalseを返すように修正できる。models.py内のメソッドを修正し、日付が過去の場合のみTrueを返すようにする。コードは以下。

```python
def was_published_recently(self):
    now = timezone.now()
    return now - datetime.timedelta(days=1) <= self.pub_date <= now
```

結果は以下。

```bash
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
.
----------------------------------------------------------------------
Ran 1 test in 0.001s

OK
Destroying test database for alias 'default'...
```

より包括的なテストを行えるように同じクラスに二つのテストを追加する。コードは以下。

```python
    def test_was_published_recently_with_old_question(self):
        """
        was_published_recently() returns False for questions whose pub_date
        is older than 1 day.
        """
        time = timezone.now() - datetime.timedelta(days=1, seconds=1)
        old_question = Question(pub_date=time)
        self.assertIs(old_question.was_published_recently(), False)


    def test_was_published_recently_with_recent_question(self):
        """
        was_published_recently() returns True for questions whose pub_date
        is within the last day.
        """
        time = timezone.now() - datetime.timedelta(hours=23, minutes=59, seconds=59)
        recent_question = Question(pub_date=time)
        self.assertIs(recent_question.was_published_recently(), True)
```

過去、現在、未来の質問に対して意味のある値を返せるように確認するテストを設定した。

### ビューのテスト

DjangoではビューレベルでのユーザのインタラクションをテストできるClientを用意している。tests.pyかshellで使用できる。コマンドと結果は以下。

```bash
$ python manage.py shell

>>> from django.test.utils import setup_test_environment
>>> setup_test_environment();

>>> from django.test import Client
>>> client = Client();

>>> response = client.get("/")
Not Found: /

>>> response.status_code
404

>>> from django.urls import reverse
>>> response = client.get(reverse("polls:index"))
>>> response.status_code
200
>>> response.content
b'\n    <ul>\n    \n        <li><a href="/polls/1/">What&#x27;s up?</a></li>\n    \n    </ul>\n\n'
>>> response.context["latest_question_list"]
<QuerySet [<Question: What's up?>]>
```

### ビューの改良

現在のままでは投票リストが公開前の投票を表示してしまうため修正する必要がある。コードは以下。

```python
class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        return Question.objects.order_by("-pub_date")[:5]
```

また、日付をtimezone.nowと比較して未来か否か確認するため、Importとget_querysetメソッドを追加、修正する。

```python
from django.utils import timezone

    def get_queryset(self):
        return Question.objects.filter(pub_date__lte=timezone.now()).order_by("-pub_date")[:5]
```
Question.objects.filter(pub_date__lte=timezone.now())は、pub_dateがtimezone.now以前ならばQuestionを含んだクエリセットを返す。

#### 追加ビューのテスト

ビューに関するテストに関しても自動化したほうが都合も、時間的にも良い。コードは以下。

polls/tests.py

```python
from django.utls import reverse

...

def create_question(question_text, days):
        time = timezone.now() + datetime.timedelta(days=days)
        return Question.objects.create(question_text=question_text, pub_date=time)
 
class QuestionIndexViewTests(TestCase):
    def test_no_questions(self):
            response = self.client.get(reverse("polls:index"))
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, "No polls are available.")
            self.assertQuerySetEqual(response.context["latest_question_list"], [])

    def test_past_question(self):
            question = create_question(question_text="Past question.", days=-30)
            response = self.client.get(reverse("polls:index"))
            self.assertQuerySetEqual(
                response.context["latest_question_list"],
                [question],
            )
            
    def test_future_question(self):
            create_question(question_text="Future question.", days=30)
            response = self.client.get(reverse("polls:index"))
            self.assertContains(response.context["least_question_list"],[])
        
    def test_future_question_and_past_question(self):
            question = create_question(question_text = "Past question.", dyas = -30)
            create_question(question_text = "Future question.", days = 30)
            response = self.client.get(reverse("polls:index"))
            self.assertQuerySetEqual(
                response.context["latest_question_list"],
                [question],
            )

    def test_two_past_questions(self):
            question1 = create_question(question_text="Past question 1.", days=-30)
            question2 = create_question(question_text="Past question 2.", days=-5)
            response = self.client.get(reverse("polls:index"))
            self.assertQuerySetEqual(
                response.context["latest_question_list"],
                [question2, question1],
            )
```

- question作成処理のコード重複を回避するため、ショートカット関数のcreate_quesitonを作成。
- test_index_view_with_no_questionsは、questionを一つも作らない代わりに、NO polls are availableとメッセージが表示されているか、latest_question_listが空か確認する。
- test_index_view_with_a_past_questionは、questionを作成し、リストに現れるか確認する。
- test_index_view_with_a_future_questionは、pub_dateが未来の日付の質問を作成、DBは各メソッド毎にリセットされるため、DBには最初の質問は残っておらず、indexページにquestionは一つもない。

### 残った部分に関するテスト

未来の質問はindexに表示されないように設定できたものの、URLを推測して到達することができる。対処するため、DetailViewに規約を追加する必要がある。コードは以下。

```python
    ...
    def get_queryset(self):
        return Question.objects.filter(pub_date__lte = timezone.now())
```

pub_dateが過去のものならQuestionを表示、未来なら表示しない設定を確認するためにテストを追加する。

```python
class QuestionDetailViewTests(TestCase):
    def test_future_question(self):
        future_question = create_question(question_text = "Futere question.", days = 5)
        url = reverse("polls:detail", args = (future_question.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_past_question(self):
        past_question = create_question(question_text = "Past Question.", days = -5)
        url = reverse("polls:detail", args = (past_question.id,))
        response = self.client.get(url)
        self.assertContains(response, past_question.quesiton_text)
```

### テストの追加について

また他にもResultViewにも同様にget_querysetメソッドを追加し、新しいテストクラスを作成するべき。上記コードと似たものを作成することになり、重複だらけになる。

テストの追加によってアプリの改善は進む。現状なら例えば、Choicesを持たないQuestionsが公開可能になっている点。

また、管理者ユーザーは他のユーザーと違い、公開されていないQuestionsを見ることができた方がいいかもしれない。

テストを書くタイミングは自由であり、またテストの量が膨らみコードが苦しいほどに成長してしまっても、構わない。テストを書いた後、内容を忘れてしまっても問題はない。ただ、ある程度の期間ごとにテストのチェックをするべき。テストを管理する面において、テスト記述ルールは以下。

- モデル、ビュー事にTestClassを分割
- テストしたい条件の集まりそれぞれに対して、異なるテストメソッドを作成
- テストメソッドの名前は機能を説明するものに設定

## 静的ファイルの扱い

アプリのディレクトリ内、staticディレクトリからDjangoは静的ファイルを探査する。内部の処理はpolls/templates/からテンプレートを探査する方法と同様。

DjangoのSTATICFILES_FINDERSは様々なソースから静的ファイルを検索する方法を知っているファインダのリスト。デフォルトファインダの必突はAppDirectoriesFinderでINSTALLED_APPSに記述された各アプリに対し、pollsのようなstaticサブディレクトリを検索する。管理サイトの静的ファイルにも同じディレクトリ構造が使用される。

staticディレクトリ内にpollsディレクトリを作成し、その中にstyle.cssを作成。（polls/static/polls/style.css）AppDirectoriesFinderのスタティックファイルファインダの動作によって、Djangoではスタティックファイルをpolls/style.cssとして参照できる。

フォルダ構造が難解になるが、Djangoでは名前が一致する最も早く見つけたものを返すので、より正確な検索を行うためにディレクトリ名で縛りをつける。

### CSS

簡単なCSSで適用方法を確認する。コードは以下。

polls/static/polls/style.css

```css
li a {
    color: green;
}
```

index.html上部にコード追加。

polls/templates/polls/index.html

```html
{% load static %}

<link rel="stylesheet" href="{% static 'polls/style.css' %}">
```

サーバーを再起動することで、質問リンクの色が緑色へ変更、CSSが適用されていることを確認できる。

### Image

画像用ディレクトリはpolls/static/polls/ディレクトリ内にimagesサブディレクトリを作成。このディレクトリ内に使用したい画像ファイルを追加することでアプリ内で利用できる。