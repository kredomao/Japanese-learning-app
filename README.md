# 日本語学習アプリ（ことわざ・言い回し）🎮🤖

日本語学習のためのロジック・データ管理ライブラリです。
**ゲーミフィケーション + AI例文生成 搭載！**

## 📁 ディレクトリ構成

```
src/
├── types/              # 型定義
│   ├── index.ts        # 基本型
│   └── ai.ts           # 🤖 AI関連型
├── data/               # 静的データ
│   ├── phrases.json    # ことわざデータ
│   └── achievements.ts # 実績・報酬定義
├── lib/                # ビジネスロジック
│   ├── experience.ts   # 経験値・レベル
│   ├── learning.ts     # 学習完了処理
│   ├── storage.ts      # LocalStorage
│   ├── gamification.ts # 🎮 ゲーミフィケーション
│   ├── ai-service.ts   # 🤖 OpenAI API連携
│   └── index.ts
├── hooks/              # React Hooks
│   ├── useUserState.ts # ユーザー状態管理
│   └── useAI.ts        # 🤖 AI機能フック
└── app/api/ai/         # 🤖 Next.js API Routes
    ├── generate-examples/route.ts
    └── explain-phrase/route.ts
```

---

## 🎮 ゲーミフィケーション機能

### 🏆 実績システム（Achievements）

20種類以上の実績を解除できます！

| レアリティ | 色 | 例 |
|-----------|-----|-----|
| 🔘 ノーマル | グレー | 最初の一歩、学習開始 |
| 🔵 レア | ブルー | 一週間の戦士、知恵の探求者 |
| 🟣 エピック | パープル | 月間マスター、半世紀の知恵 |
| 🟡 レジェンダリー | ゴールド | 百日の修行、生きた辞書 |

```tsx
const { pendingAchievements, dismissAchievement } = usePhraselearning(phrases);

// 新しい実績が解除されたら表示
if (pendingAchievements.length > 0) {
  const achievement = pendingAchievements[0];
  // 🎉 モーダル表示などで通知
  console.log(`${achievement.icon} ${achievement.name} 解除！`);
}
```

### 🔥 連続学習ボーナス（Streak）

毎日学習すると経験値にボーナスが付きます！

| 連続日数 | 倍率 | ボーナスEXP | メッセージ |
|---------|------|------------|-----------|
| 3日 | ×1.1 | +5 | 3日連続！調子いいね！🔥 |
| 7日 | ×1.2 | +20 | 1週間連続！すごい！🌟 |
| 14日 | ×1.3 | +50 | 2週間達成！継続は力なり！💪 |
| 30日 | ×1.5 | +100 | 1ヶ月継続！あなたは本物だ！🏆 |
| 100日 | ×2.0 | +500 | 100日達成！伝説の学習者！👑 |

```tsx
const { currentStreakBonus, nextStreakMilestone, userState } = usePhraselearning(phrases);

// 現在の連続日数
console.log(`🔥 ${userState.streak}日連続！`);

// 次のマイルストーン
if (nextStreakMilestone) {
  console.log(`あと${nextStreakMilestone.days - userState.streak}日で${nextStreakMilestone.message}`);
}
```

### 📋 デイリーミッション

毎日3つのミッションが生成されます。

```tsx
const { dailyMissions, claimMission } = usePhraselearning(phrases);

dailyMissions.forEach((mission) => {
  console.log(`${mission.description}: ${mission.progress.current}/${mission.target}`);
  
  if (mission.progress.completed && !mission.progress.claimedAt) {
    // 報酬を受け取る
    const reward = claimMission(mission.id);
    console.log(`+${reward} EXP獲得！`);
  }
});
```

### 🎁 レベルアップ報酬

特定のレベルで称号やボーナスEXPを獲得！

| レベル | 報酬 |
|--------|------|
| Lv5 | 称号「入門者」+ 25 EXP |
| Lv10 | 称号「学習の探求者」+ 50 EXP |
| Lv20 | 称号「言い回しの使い手」+ 100 EXP |
| Lv25 | 上級ことわざ解放 + 125 EXP |
| Lv30 | 称号「ことわざ博士」+ 150 EXP |
| Lv50 | 称号「日本語の達人」+ 300 EXP |
| Lv100 | 称号「伝説の語り部」+ 1000 EXP 🏆 |

---

## 🚀 使い方

### 基本的な使用（フル機能）

```tsx
import { usePhraselearning, Phrase } from '@/';
import phrases from '@/data/phrases.json';

function App() {
  const {
    // 基本
    currentPhrase,
    learnAndNext,
    progress,
    expProgress,
    
    // ゲーミフィケーション
    userState,
    currentStreakBonus,
    pendingAchievements,
    dailyMissions,
    achievementProgress,
    
    // アクション
    dismissAchievement,
    claimMission,
    changeTitle,
  } = usePhraselearning(phrases as Phrase[]);

  return (
    <div>
      {/* ステータスバー */}
      <header>
        <span>🔥 {userState.streak}日連続</span>
        <span>⭐ Lv.{userState.level}</span>
        <span>🏆 {achievementProgress.unlocked}/{achievementProgress.total}</span>
      </header>

      {/* メインコンテンツ */}
      {currentPhrase && (
        <div>
          <h1>{currentPhrase.phrase}</h1>
          <p>{currentPhrase.meaning}</p>
          <button onClick={() => learnAndNext(currentPhrase.id)}>
            覚えた！ (+{currentStreakBonus?.expMultiplier || 1}x EXP)
          </button>
        </div>
      )}

      {/* 実績通知 */}
      {pendingAchievements.length > 0 && (
        <AchievementModal
          achievement={pendingAchievements[0]}
          onDismiss={() => dismissAchievement(pendingAchievements[0].id)}
        />
      )}
    </div>
  );
}
```

### 実績一覧ページ

```tsx
import { useAchievements, getRarityColor, getRarityName } from '@/';

function AchievementsPage() {
  const { byCategory, progress } = useAchievements();

  return (
    <div>
      <h1>🏆 実績 ({progress.unlocked}/{progress.total})</h1>
      
      {Object.entries(byCategory).map(([category, achievements]) => (
        <section key={category}>
          <h2>{category}</h2>
          {achievements.map((a) => (
            <div
              key={a.id}
              style={{
                opacity: a.isUnlocked ? 1 : 0.5,
                borderColor: getRarityColor(a.rarity),
              }}
            >
              <span>{a.icon}</span>
              <span>{a.name}</span>
              <span>{getRarityName(a.rarity)}</span>
              {a.isUnlocked && <span>✓</span>}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
```

---

## 📊 データ構造

### UserState（拡張版）

```typescript
interface UserState {
  // 基本ステータス
  level: number;
  experience: number;
  totalExp: number;              // 累計経験値
  learnedPhraseIds: number[];
  
  // 連続学習
  streak: number;
  bestStreak: number;            // 最高記録
  lastLearnedAt: string | null;
  
  // ゲーミフィケーション
  unlockedAchievements: UnlockedAchievement[];
  currentTitle: string;          // 現在の称号
  unlockedTitles: string[];      // 解放済み称号
  dailyMissions: DailyMissionState | null;
  
  // 統計
  stats: UserStats;
}
```

### LearningResult（学習完了時の戻り値）

```typescript
interface LearningResult {
  success: boolean;
  userState: UserState;
  experienceResult: {
    experienceGained: number;
    bonusExp: number;             // ボーナス経験値
    streakMultiplier: number;     // 連続学習倍率
    leveledUp: boolean;
  };
  isNewPhrase: boolean;
  streakUpdated: boolean;
  
  // 🎮 ゲーミフィケーション
  newAchievements: Achievement[]; // 新しく解除された実績
  levelReward: LevelReward | null;
  missionProgress: MissionProgress[];
}
```

---

## ⭐ 経験値・レベルシステム

### 基本経験値
- 学習1件完了: **+10 EXP**（連続学習ボーナスで最大 ×2.0）
- レベルアップ必要EXP: **レベル × 100**

### 称号一覧
| レベル | デフォルト称号 |
|--------|---------------|
| 1-4 | 初心者 |
| 5-9 | 入門者 |
| 10-19 | 学習の探求者 |
| 20-29 | 言い回しの使い手 |
| 30-39 | ことわざ博士 |
| 40-49 | 言葉の師範 |
| 50+ | 日本語の達人 |

**※ 実績解除で追加称号を獲得可能！**

---

---

## 🤖 AI例文生成（OpenAI API）

### セットアップ

1. `env.example.txt` を `.env.local` にリネーム
2. OpenAI APIキーを設定

```bash
# .env.local
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini  # オプション
```

### 基本的な使い方

```tsx
import { useAILearning, usePhraselearning } from '@/';

function LearningPage() {
  const { currentPhrase, userState } = usePhraselearning(phrases);
  
  const {
    examples,
    examplesLoading,
    generateExamples,
    explanation,
    explainCurrentPhrase,
  } = useAILearning(currentPhrase, userState.level);

  return (
    <div>
      <h1>{currentPhrase?.phrase}</h1>
      
      {/* AI例文生成ボタン */}
      <button onClick={generateExamples} disabled={examplesLoading}>
        {examplesLoading ? '生成中...' : '🤖 AI例文を生成'}
      </button>

      {/* 生成された例文 */}
      {examples.map((ex, i) => (
        <div key={i}>
          <p>{ex.sentence}</p>
          <small>💡 {ex.situation}</small>
        </div>
      ))}

      {/* AI解説ボタン */}
      <button onClick={explainCurrentPhrase}>
        📖 詳しい解説を見る
      </button>

      {explanation && (
        <div>
          <p><strong>簡単に:</strong> {explanation.simple}</p>
          <p><strong>詳しく:</strong> {explanation.detailed}</p>
          {explanation.history && <p><strong>由来:</strong> {explanation.history}</p>}
        </div>
      )}
    </div>
  );
}
```

### 利用可能なHooks

| Hook | 説明 |
|------|------|
| `useExampleGenerator` | 基本の例文生成 |
| `usePhraseExplainer` | ことわざ解説生成 |
| `useCachedExampleGenerator` | キャッシュ付き例文生成 |
| `useAILearning` | 学習機能と統合されたAIフック |

### API Endpoints

| Endpoint | Method | 説明 |
|----------|--------|------|
| `/api/ai/generate-examples` | POST | 例文を生成 |
| `/api/ai/explain-phrase` | POST | ことわざを解説 |

### 例文生成リクエスト例

```typescript
// POST /api/ai/generate-examples
{
  "phrase": "七転び八起き",
  "meaning": "何度失敗しても諦めずに立ち上がること",
  "userLevel": 10,
  "count": 3
}
```

### レスポンス例

```json
{
  "success": true,
  "examples": [
    {
      "sentence": "彼は七転び八起きの精神で、何度も起業に挑戦した。",
      "situation": "ビジネスの挫折から立ち直る場面",
      "difficulty": "medium"
    }
  ]
}
```

### コスト目安

| モデル | 1リクエストあたり | 月100リクエスト |
|--------|------------------|-----------------|
| gpt-4o-mini | 約$0.001 | 約$0.10 |
| gpt-4o | 約$0.01 | 約$1.00 |

---

## 🔧 セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数設定（AI機能を使う場合）
cp env.example.txt .env.local
# .env.local を編集してAPIキーを設定

# 開発サーバー起動
npm run dev
```

---

## 🔜 今後の拡張

- ✅ クイズ機能（`MissionType.perfect_streak` で対応準備済み）
- ✅ レベル別コンテンツ解放（Lv25で上級ことわざ解放）
- ✅ バックエンド移行（`storage.ts` 差し替えでOK）
- ✅ AIによる例文生成（OpenAI API連携）
- ⬜ ランキング機能
- ⬜ フレンド機能
