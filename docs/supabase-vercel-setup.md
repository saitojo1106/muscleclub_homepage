# Supabase と Vercel の連携セットアップガイド

このガイドでは、Muscle Club Homepageプロジェクトの Supabase と Vercel の連携設定方法について説明します。

## 目次

1. [必要条件](#必要条件)
2. [Supabase プロジェクトのセットアップ](#supabase-プロジェクトのセットアップ)
3. [Vercel の環境変数設定](#vercel-の環境変数設定)
4. [データベース移行](#データベース移行)
5. [ストレージバケットの設定](#ストレージバケットの設定)
6. [認証設定](#認証設定)
7. [Row Level Security（RLS）ポリシー](#row-level-securityrls-ポリシー)
8. [トラブルシューティング](#トラブルシューティング)

## 必要条件

- [Supabase](https://supabase.com/) アカウント（無料プランで開始可能）
- [Vercel](https://vercel.com/) アカウント（無料プランで開始可能）
- Git リポジトリ（GitHub, GitLab, Bitbucket など）

## Supabase プロジェクトのセットアップ

1. Supabase ダッシュボードにログインし、新しいプロジェクトを作成します
2. プロジェクト名を設定し、リージョンを選択（東京が最適: `ap-northeast-1`）
3. データベースパスワードを設定し、プロジェクトを作成

プロジェクトが作成されたら、以下の情報を控えておきます：

- **Project URL**: `https://[プロジェクト ID].supabase.co`
- **API Key**: `[anon/public]` キー
- **Database URL**: PostgreSQL 接続文字列

## Vercel の環境変数設定

Vercel ダッシュボードで、以下の環境変数を設定します：

1. プロジェクトの「Settings」→「Environment Variables」に移動
2. 以下の変数を追加：

```
NEXT_PUBLIC_SUPABASE_URL=https://[プロジェクトID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon/public key]
NEXTAUTH_URL=https://[あなたのVercelドメイン]
NEXTAUTH_SECRET=[ランダムに生成された秘密キー]
```

秘密キーの生成方法（ターミナルで実行）：
```bash
openssl rand -base64 32
```

3. 「Save」をクリックして変数を保存

**重要**: 環境変数のスコープを設定する

- `NEXT_PUBLIC_` で始まる変数は「All」（全環境）に設定
- その他の秘密変数は「Production」および「Preview」環境のみに設定

## データベース移行

### テーブル作成

以下の SQL を Supabase の SQL Editor で実行してテーブルを作成します：

```sql
-- イベントテーブル
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  fee VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- メンバーテーブル
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  year VARCHAR(50),
  speciality VARCHAR(255),
  message TEXT,
  records TEXT,
  instagram VARCHAR(255),
  image TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### トリガーの設定（更新日時自動更新）

更新日時を自動更新するトリガーを設定します：

```sql
-- updated_at を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- イベントテーブルのトリガー
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- メンバーテーブルのトリガー
CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

## ストレージバケットの設定

Supabase ストレージバケットを設定します：

1. Supabase ダッシュボードの「Storage」ページに移動
2. 以下のバケットを作成：
   - `events`: イベント画像用
   - `members`: メンバープロフィール画像用
   - `general`: 一般的な画像用
3. 各バケットの「Policies」タブで、適切なアクセス権限を設定：

### 推奨されるポリシー設定

#### イベントバケット

```sql
-- 匿名ユーザーは読み取りのみ可能
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'events');

-- 認証済みユーザーは追加・削除可能
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Authenticated Users Can Update Own Files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'events' AND auth.uid() = owner);

CREATE POLICY "Authenticated Users Can Delete Own Files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'events' AND auth.uid() = owner);
```

メンバーとジェネラルバケットも同様の設定を行います。

## 認証設定

### メール認証の設定

1. Supabase ダッシュボードの「Authentication」→「Providers」に移動
2. 「Email」プロバイダーを有効化
3. 設定：
   - 「Confirm email」を有効化
   - 「Secure email change」を有効化
   - 「Enable automatic confirm」を無効化

### OAuth プロバイダー設定（オプション）

Google, GitHub, Twitter などの OAuth プロバイダーを必要に応じて設定します。

### リダイレクト URL の設定

「URL Configuration」セクションで、以下の URL を追加：

```
https://[あなたのVercelドメイン]/auth/callback
https://localhost:3000/auth/callback
```

## Row Level Security（RLS）ポリシー

データベースのセキュリティを確保するために RLS ポリシーを設定します：

### イベントテーブルの例

```sql
-- RLS を有効化
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに読み取り権限を付与
CREATE POLICY "Events are viewable by everyone"
ON events FOR SELECT
TO anon, authenticated
USING (true);

-- 認証済みユーザーのみ作成・更新・削除可能
CREATE POLICY "Authenticated users can insert events"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
ON events FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete events"
ON events FOR DELETE
TO authenticated
USING (true);
```

## トラブルシューティング

### 認証エラー

- 認証コールバックが機能しない場合、次のことを確認してください：
  - リダイレクト URL が正しく設定されているか
  - `NEXTAUTH_URL` が正しく設定されているか
  - `src/app/api/auth/callback/route.ts` が存在するか

### 環境変数の問題

環境変数が正しく読み込まれない場合：

1. Vercel ダッシュボードで環境変数が正しく設定されているか確認
2. プロジェクトを再デプロイしてみる
3. ローカル開発環境では `.env.local` ファイルが正しく設定されているか確認

### ストレージの問題

- アップロードエラーが発生する場合、バケットポリシーを確認
- ファイルサイズが制限を超えていないか確認（デフォルト: 5MB）

---

このセットアップガイドに関する質問や問題がありましたら、プロジェクトリポジトリの Issue セクションで報告してください。

