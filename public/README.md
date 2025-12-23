# 📸 画像の使い方

## 画像の配置方法

1. **ローカル画像を使う場合**
   ```
   public/
   └── images/
       └── vocabulary/
           ├── chair.jpg      (椅子)
           ├── desk.jpg       (机)
           ├── bed.jpg        (ベッド)
           └── table.jpg      (テーブル)
   ```

2. **データでの指定方法**
   ```typescript
   { 
     id: 1, 
     word: '椅子', 
     image: '/images/vocabulary/chair.jpg',  // ← これ
     ...
   }
   ```

3. **外部URLを使う場合**
   ```typescript
   { 
     id: 1, 
     word: '椅子', 
     image: 'https://example.com/chair.jpg',  // ← これ
     ...
   }
   ```

4. **絵文字を使う場合（従来通り）**
   ```typescript
   { 
     id: 1, 
     word: '椅子', 
     image: '🪑',  // ← これ
     ...
   }
   ```

## 画像の推奨サイズ

- **学習画面**: 200x200px 以上
- **クイズ画面**: 150x150px 以上
- **形式**: JPG, PNG, WebP 対応

## 無料画像リソース

- **Unsplash**: https://unsplash.com
- **Pexels**: https://www.pexels.com
- **Pixabay**: https://pixabay.com

## 注意事項

- 画像ファイル名は英数字とハイフンのみ推奨
- ファイルサイズは1MB以下を推奨（読み込み速度のため）

