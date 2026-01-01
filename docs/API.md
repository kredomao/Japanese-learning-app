# 日本語学習アプリ - API仕様書

## 概要

このドキュメントは、日本語学習アプリのコアロジックAPIの仕様を定義します。
UI非依存の純粋関数として実装されており、Bolt.newなどのUIフレームワークから使用可能です。

---

## 1. 経験値・レベル管理 API

### `gainExperience(currentState: UserState): ExperienceResult`

学習1件完了で経験値を獲得し、レベルアップ処理を行う。

**パラメータ**:
- `currentState: UserState` - 現在のユーザー状態

**戻り値**:
```typescript
{
  newExperience: number;      // 更新後の経験値
  newLevel: number;          // 更新後のレベル
  leveledUp: boolean;        // レベルアップしたかどうか
  experienceGained: number;   // 獲得経験値（常に10）
  bonusExp: number;          // ボーナス経験値（0）
  streakMultiplier: number;  // 連続学習倍率（1）
}
```

**仕様**:
- 学習1件完了で experience +10
- 次のレベルに必要な経験値は level × 100
- 複数回レベルアップに対応（自動処理）

**使用例**:
```typescript
import { gainExperience } from './lib/experience';

const result = gainExperience(currentState);
if (result.leveledUp) {
  console.log(`レベルアップ！ Lv.${result.newLevel}`);
}
```

---

### `checkLevelUp(state: UserState): boolean`

レベルアップ可能かチェックする。

**パラメータ**:
- `state: UserState` - ユーザー状態

**戻り値**:
- `boolean` - レベルアップ可能な場合`true`

**使用例**:
```typescript
import { checkLevelUp } from './lib/experience';

if (checkLevelUp(userState)) {
  console.log('レベルアップ可能！');
}
```

---

### `getRequiredExpForLevel(level: number): number`

次のレベルに必要な経験値を計算する。

**パラメータ**:
- `level: number` - 現在のレベル

**戻り値**:
- `number` - 必要経験値（level × 100）

**使用例**:
```typescript
import { getRequiredExpForLevel } from './lib/experience';

const required = getRequiredExpForLevel(5); // 500
```

---

### `getExpProgress(state: UserState): ExpProgress`

現在のレベルでの経験値進捗を取得する。

**パラメータ**:
- `state: UserState` - ユーザー状態

**戻り値**:
```typescript
{
  current: number;      // 現在の経験値
  required: number;    // 必要経験値
  percentage: number;  // 進捗率（0-100）
}
```

**使用例**:
```typescript
import { getExpProgress } from './lib/experience';

const progress = getExpProgress(userState);
console.log(`${progress.percentage}% (${progress.current}/${progress.required})`);
```

---

## 2. 学習完了処理 API

### `markAsLearned(phraseId: number): LearningResult`

「覚えた」ボタン押下時の処理（MVP版）。

**パラメータ**:
- `phraseId: number` - 学習したフレーズID

**戻り値**:
```typescript
{
  success: boolean;           // 保存成功フラグ
  learnedPhraseId: number;    // 学習したフレーズID
  experienceGained: number;   // 獲得経験値
  leveledUp: boolean;        // レベルアップフラグ
  newLevel: number;          // 新しいレベル
  newExperience: number;     // 新しい経験値
  userState: UserState;      // 更新後のユーザー状態
}
```

**処理内容**:
1. LocalStorageから現在のユーザー状態を読み込み
2. 学習済みIDを保存（重複チェック）
3. 経験値を加算（+10）
4. レベルアップ判定
5. LocalStorageに保存
6. 処理結果を返す

**使用例**:
```typescript
import { markAsLearned } from './lib/learning';

// 「覚えた」ボタンを押したとき
const result = markAsLearned(phraseId);

if (result.success) {
  if (result.leveledUp) {
    // レベルアップ通知を表示
    showLevelUpNotification(result.newLevel);
  }
  // 経験値獲得通知を表示
  showExpGainNotification(result.experienceGained);
}
```

---

### `completeLearning(...): LearningResult`

学習完了処理（フル機能版・ゲーミフィケーション対応）。

**パラメータ**:
- `currentState: UserState` - 現在のユーザー状態
- `phraseId: number` - 学習したフレーズID
- `phrase?: Phrase` - フレーズデータ（実績・ミッション判定用）
- `allPhrases?: Phrase[]` - 全フレーズデータ（タグ実績判定用）

**戻り値**:
```typescript
{
  success: boolean;
  userState: UserState;
  experienceResult: ExperienceResult;
  isNewPhrase: boolean;
  streakUpdated: boolean;
  newAchievements: Achievement[];
  levelReward: LevelReward | null;
  missionProgress: MissionProgress[];
}
```

**処理内容**:
- `markAsLearned`の機能に加えて:
  - 連続学習ボーナス適用
  - 実績チェック・解除
  - デイリーミッション更新
  - レベルアップ報酬チェック

**使用例**:
```typescript
import { completeLearning } from './lib/learning';

const result = completeLearning(
  currentState,
  phraseId,
  phrase,
  allPhrases
);

// 新しい実績が解除された場合
if (result.newAchievements.length > 0) {
  result.newAchievements.forEach(achievement => {
    showAchievementNotification(achievement);
  });
}
```

---

## 3. ストレージ管理 API

### `loadUserState(): UserState`

LocalStorageからユーザー状態を読み込む。

**戻り値**:
- `UserState` - ユーザー状態（存在しない場合は初期値）

**使用例**:
```typescript
import { loadUserState } from './lib/storage';

const userState = loadUserState();
console.log(`現在のレベル: ${userState.level}`);
```

---

### `saveUserState(state: UserState): boolean`

ユーザー状態をLocalStorageに保存する。

**パラメータ**:
- `state: UserState` - 保存するユーザー状態

**戻り値**:
- `boolean` - 保存成功かどうか

**使用例**:
```typescript
import { saveUserState } from './lib/storage';

const success = saveUserState(updatedState);
if (!success) {
  console.error('保存に失敗しました');
}
```

---

### `resetUserState(): boolean`

ユーザー状態をリセットする。

**戻り値**:
- `boolean` - リセット成功かどうか

**使用例**:
```typescript
import { resetUserState } from './lib/storage';

if (confirm('本当にリセットしますか？')) {
  resetUserState();
}
```

---

### `checkStreakUpdate(lastLearnedAt: string | null): StreakCheckResult`

連続学習日数の更新判定を行う。

**パラメータ**:
- `lastLearnedAt: string | null` - 最終学習日時（ISO形式）

**戻り値**:
```typescript
{
  shouldIncrement: boolean;  // 連続日数を増やすか
  shouldReset: boolean;      // リセットするか
}
```

**判定ロジック**:
- 同じ日: 変更なし
- 翌日: 連続日数を増やす
- 2日以上空いた: リセットして1から

**使用例**:
```typescript
import { checkStreakUpdate } from './lib/storage';

const streakCheck = checkStreakUpdate(userState.lastLearnedAt);
if (streakCheck.shouldIncrement) {
  // 連続日数を増やす処理
} else if (streakCheck.shouldReset) {
  // 連続日数をリセット
}
```

---

## 4. 学習進捗管理 API

### `getLearningProgress(state: UserState, totalPhrases: number): Progress`

学習進捗を取得する。

**パラメータ**:
- `state: UserState` - ユーザー状態
- `totalPhrases: number` - 全フレーズ数

**戻り値**:
```typescript
{
  learnedCount: number;   // 学習済み数
  totalCount: number;     // 全数
  percentage: number;     // 進捗率（0-100）
}
```

**使用例**:
```typescript
import { getLearningProgress } from './lib/learning';

const progress = getLearningProgress(userState, phrases.length);
console.log(`${progress.learnedCount}/${progress.totalCount} (${progress.percentage}%)`);
```

---

### `getUnlearnedPhraseIds(state: UserState, allPhraseIds: number[]): number[]`

未学習のフレーズIDを取得する。

**パラメータ**:
- `state: UserState` - ユーザー状態
- `allPhraseIds: number[]` - 全フレーズID配列

**戻り値**:
- `number[]` - 未学習のフレーズID配列

**使用例**:
```typescript
import { getUnlearnedPhraseIds } from './lib/learning';

const unlearnedIds = getUnlearnedPhraseIds(
  userState,
  phrases.map(p => p.id)
);
console.log(`未学習: ${unlearnedIds.length}個`);
```

---

### `getRandomUnlearnedPhraseId(state: UserState, allPhraseIds: number[]): number | null`

ランダムな未学習フレーズIDを取得する。

**パラメータ**:
- `state: UserState` - ユーザー状態
- `allPhraseIds: number[]` - 全フレーズID配列

**戻り値**:
- `number | null` - ランダムな未学習フレーズID（存在しない場合は`null`）

**使用例**:
```typescript
import { getRandomUnlearnedPhraseId } from './lib/learning';

const nextPhraseId = getRandomUnlearnedPhraseId(
  userState,
  phrases.map(p => p.id)
);

if (nextPhraseId) {
  // 次のフレーズを表示
  showPhrase(nextPhraseId);
} else {
  // 全て学習済み
  showCompletionMessage();
}
```

---

## 5. エラーハンドリング

### エラーケース

1. **LocalStorageが使用不可**
   - `loadUserState()`: 初期値を返す
   - `saveUserState()`: `false`を返す

2. **データ破損**
   - `loadUserState()`: 初期値を返す（エラーログ出力）

3. **重複学習**
   - `markAsLearned()`: 経験値は加算しないが、成功として処理

---

## 6. 型定義

### 主要な型

```typescript
// ユーザー状態
interface UserState {
  level: number;
  experience: number;
  totalExp: number;
  learnedPhraseIds: number[];
  streak: number;
  bestStreak: number;
  lastLearnedAt: string | null;
  // ... その他
}

// 経験値結果
interface ExperienceResult {
  newExperience: number;
  newLevel: number;
  leveledUp: boolean;
  experienceGained: number;
  bonusExp: number;
  streakMultiplier: number;
}

// 学習結果
interface LearningResult {
  success: boolean;
  learnedPhraseId: number;
  experienceGained: number;
  leveledUp: boolean;
  newLevel: number;
  newExperience: number;
  userState: UserState;
}
```

詳細は `src/types/index.ts` を参照してください。

---

## 7. 使用例（統合）

```typescript
import {
  markAsLearned,
  loadUserState,
  getLearningProgress,
  getRandomUnlearnedPhraseId,
} from './lib';

// 初期化
let userState = loadUserState();
const allPhraseIds = phrases.map(p => p.id);

// 次のフレーズを取得
const nextPhraseId = getRandomUnlearnedPhraseId(userState, allPhraseIds);

if (nextPhraseId) {
  // 「覚えた」ボタンを押したとき
  const result = markAsLearned(nextPhraseId);
  
  if (result.success) {
    // 状態を更新
    userState = result.userState;
    
    // レベルアップ通知
    if (result.leveledUp) {
      showNotification(`レベルアップ！ Lv.${result.newLevel}`);
    }
    
    // 経験値獲得通知
    showNotification(`+${result.experienceGained} EXP`);
    
    // 進捗更新
    const progress = getLearningProgress(userState, phrases.length);
    updateProgressBar(progress.percentage);
  }
}
```

---

## まとめ

このAPIは以下の特徴があります:

1. **UI非依存**: 純粋関数として実装
2. **型安全**: TypeScriptで型定義
3. **シンプル**: MVPとして最小限の機能
4. **拡張可能**: 将来的な機能追加に対応

詳細な実装は `src/lib/` ディレクトリを参照してください。

