# Schema Base Editor

This project is a schema-driven UI builder application using React + Vite + Bun.

## Features

- スキーマ駆動型のノーコードUIビルダー
- Valibotを使用した型安全なデータ検証
- 様々なUIコンポーネントの追加と設定
- リアルタイムプレビュー

## 技術スタック

- React 18
- TypeScript
- Vite
- Bun
- Valibot（スキーマバリデーション）
- TailwindCSS（スタイリング）
- React Router DOM（ルーティング）

## 始め方

### 前提条件

- [Bun](https://bun.sh)をインストールしていること

### インストール

```bash
# 依存関係のインストール
bun install
```

### 開発サーバーの起動

```bash
# 開発サーバーの起動
bun dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開いてアプリケーションを表示します。

### ビルド

```bash
# 本番用にビルド
bun run build
```

### プレビュー

```bash
# ビルドしたアプリケーションをプレビュー
bun run preview
```

## プロジェクト構造

```
/
├── public/             # 静的ファイル
├── src/                # ソースコード
│   ├── components/     # UIコンポーネント
│   │   └── blocks/     # UIブロックコンポーネント
│   ├── pages/          # ページコンポーネント
│   ├── App.tsx         # アプリケーションのルートコンポーネント
│   ├── index.css       # グローバルスタイル
│   ├── main.tsx        # エントリーポイント
│   └── schema.ts       # Valibotスキーマ定義
├── index.html          # HTMLエントリーポイント
├── vite.config.ts      # Vite設定
├── tailwind.config.ts  # Tailwind CSS設定
├── tsconfig.json       # TypeScript設定
└── bunfig.toml         # Bun設定
```

## ライセンス

MIT
