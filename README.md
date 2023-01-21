# アプリケーション名

### RamenSharing（ラーメンシェアリング）
![アプリ画像](https://github.com/yukikaze223422/portfolio-app/blob/main/RamenSharing.png)

<br>

# アプリケーション概要

ラーメンが好きな人が集まりおいしかったラーメンを管理・共有できるアプリです。

<br>

# アプリ URL

[portfolio-app-eta-cyan.vercel.app](https://portfolio-app-eta-cyan.vercel.app/)

<br>

# アプリを作成した背景

ポートフォリオアプリのアイディアを探していた際に、何を作れば良いのかわからず、やみくもに Google で検索をかけていました。<br>
それでも、アイデアが浮かばなかったため、浮かばないなら好きな食べ物を軸に何かを作ってみようということで私がラーメンが好きということもあり、おいしいラーメンをすぐに確認できるアプリがあればいいなと考えたことがアプリ開発のきっかけとなりました。

<br>

# テスト用アカウント

- メールアドレス　： guest@gmai.com
- パスワード　　　： guest2234

<br>

# 利用方法

1. ログイン
   - メールアドレスでログイン
   - Google でログイン
   - ゲストユーザー でログイン
   
2. 新規ユーザー登録
   - メールアドレスで登録
   - Google で登録
   
3. 投稿一覧（みんなの投稿）
   - 各カードを押下すると詳細画面へ遷移
   
4. 投稿管理（自分の投稿）
   - 各カードを押下すると詳細画面へ遷移
   
5. 投稿の作成

7. 投稿の編集/削除
    - 詳細画面にて投稿内容がログインユーザであれば編集画面に遷移可
    
8. マイページ
    - ユーザ名とプロフィールアイコンが設定可

<br>

# 機能一覧

| 機能                     | ログインユーザー | 非ログインユーザー |
| ------------------------ | ---------------- | ------------------ |
| ログイン            | ×                | ◯                  |
| ユーザー登録             | ×                | ◯                  |
| ユーザープロフィール編集 | ◯                | ×                  |
| 投稿一覧                 | ◯                | ×                  |
| 投稿する                 | ◯                | ×                  |
| 投稿管理                 | ◯                | ×                  |
| 投稿編集・削除           | ◯                | ×                  |

<br>

# 実装予定の機能

- フィルター、お気に入り、ブックマーク、都道府県設定

<br>

# 開発環境

- フロントエンド
  - React(v18.2.0)
  - Next.js(v13.0.6)
  - Typescript
  - useContext
  - Chakra UI(v2.4.3)
- バックエンド
  - Firebase (v9.15.0)
  - Maps JavaScript API(外部API)
  - Geocoding API(外部API)
- その他
  - Vercel

<br>

# 工夫した点

### 1. 投稿とユーザーの紐付け

投稿を作成した時には、投稿者が誰かわかるように、名前とアイコンを表示しています。<br>
Firebase Authenticationにおいて、ログイン情報を紐づけることで、後からユーザーがプロフィールを変更しても、全ての投稿に情報（ユーザー名とアイコン）の変更が反映されるよう実装しました。<br>
また、この紐付けにより、ログインしているユーザーは、自分が作成した投稿のみ「編集/削除」といった操作が可能となるように、実装しています。

<br>

### 2. ユーザーへのフィードバック

ユーザーが投稿の作成や編集、認証操作が完了した際に視覚的にわかるように正常にできたかのアラートを表示し、確認しやすいように実装しました。

<br>

### 3. ユーザー目線のレイアウト

極力、ユーザーに対してわかりやすいようなボタン配置にしたり、ページネーションをつけて投稿を見やすくしたりなど、シンプルで見やすく扱いやすいような設計を意識しました。

<br>

### 4. GoogleMapによる連携

投稿一覧の各カードを押下すると、詳細画面に遷移し投稿に住所を設定していると住所に応じたGoogleMapが表示されるようにしました。<br>
詳細画面に遷移した直後に、Firebase Firestoreより住所を読み込んで、Geocoding APIから取得した住所をもとに緯度・経度を取得し、Maps JavaScript APIを用いてGoogle Mapを表示させるという手順を踏んでいます。<br>
APIを初めて使ったということもあり、実装に時間がかかりましたが正常に表示させることができました。

<br>

# 苦労した点

### 1. レンダリングを意識したプログラム構成

開発をしていてコードの規模が大きくなると、ページが表示されてもデータがnullやundefindで入ったりやすることで予期せぬエラーが多発して苦労しました。<br>
次第に、開発していくうちにレンダリングを意識したプログラムを書けるようになり最終的に上記のような事象を解決し、アプリを開発することができました。<br>
今後は、レンダリングによる処理負荷の対応も考えプログラムを構築できるようさらに理解を深めていきたいと考えています。


<br>

### 2. Chakra UIによるレイアウト

初めて、UIライブラリを使用したということもあり、ChakraUI独特の記法だったり要素があって理解するのに苦労しました。<br>
ですが、使っていくうちにコード量が膨大になるというデメリットはありながらも、CSSで1から構築するより簡単に高度なUIが構築できるというメリットを活かしてスムーズにレイアウトを完成させることができました。

<br>
