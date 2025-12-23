'use client';

import { useState } from 'react';
import { usePhraselearning, useAILearning, Phrase, useVocabularyLearning } from '../';
import phrasesData from '../data/phrases.json';
import Link from 'next/link';

const phrases = phrasesData as Phrase[];

export default function Home() {
  const {
    currentPhrase,
    userState,
    expProgress,
    progress,
    learnAndNext,
    pendingAchievements,
    dismissAchievement,
    dailyMissions,
    claimMission,
    isLoading,
  } = usePhraselearning(phrases);

  const {
    examples,
    examplesLoading,
    generateExamples,
    explanation,
    explanationLoading,
    explainCurrentPhrase,
  } = useAILearning(currentPhrase, userState.level);

  const [showAI, setShowAI] = useState(false);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <p>読み込み中...</p>
      </div>
    );
  }

  const vocabState = useVocabularyLearning();
  const isProverbsUnlocked = vocabState.state.rankProgress.highestUnlockedRank >= 10;

  return (
    <div style={styles.container}>
      {/* ナビゲーション */}
      <nav style={styles.nav}>
        <Link href="/vocabulary" style={styles.navLink}>
          📚 ボキャブラリー学習
        </Link>
        {isProverbsUnlocked && (
          <Link href="/" style={styles.navLink}>
            📜 ことわざ学習
          </Link>
        )}
      </nav>

      {/* ヘッダー */}
      <header style={styles.header}>
        <div style={styles.stats}>
          <span>🔥 {userState.streak}日連続</span>
          <span>⭐ Lv.{userState.level}</span>
          <span>📚 {progress.learnedCount}/{progress.totalCount}</span>
        </div>
        <div style={styles.expBar}>
          <div 
            style={{
              ...styles.expFill,
              width: `${expProgress.percentage}%`
            }} 
          />
          <span style={styles.expText}>
            {expProgress.current} / {expProgress.required} EXP
          </span>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={styles.main}>
        {!isProverbsUnlocked ? (
          <div style={styles.lockedCard}>
            <h2>🔒 ことわざ学習はまだロックされています</h2>
            <p>ランク10（賢者）に到達すると解放されます！</p>
            <Link href="/vocabulary" style={styles.primaryButton}>
              📚 ボキャブラリー学習を始める
            </Link>
          </div>
        ) : currentPhrase ? (
          <div style={styles.card}>
            <h1 style={styles.phrase}>{currentPhrase.phrase}</h1>
            <p style={styles.reading}>{currentPhrase.reading}</p>
            <p style={styles.meaning}>{currentPhrase.meaning}</p>
            <p style={styles.example}>
              <strong>例文:</strong> {currentPhrase.example}
            </p>
            <div style={styles.tags}>
              {currentPhrase.tags.map((tag) => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>

            {/* アクションボタン */}
            <div style={styles.actions}>
              <button 
                style={styles.learnButton}
                onClick={() => learnAndNext(currentPhrase.id)}
              >
                ✅ 覚えた！ (+{10} EXP)
              </button>
              <button 
                style={styles.aiButton}
                onClick={() => setShowAI(!showAI)}
              >
                🤖 AI機能
              </button>
            </div>

            {/* AI機能 */}
            {showAI && (
              <div style={styles.aiSection}>
                <div style={styles.aiButtons}>
                  <button 
                    onClick={generateExamples}
                    disabled={examplesLoading}
                    style={styles.aiActionButton}
                  >
                    {examplesLoading ? '生成中...' : '📝 例文を生成'}
                  </button>
                  <button 
                    onClick={explainCurrentPhrase}
                    disabled={explanationLoading}
                    style={styles.aiActionButton}
                  >
                    {explanationLoading ? '生成中...' : '📖 詳しい解説'}
                  </button>
                </div>

                {/* AI例文 */}
                {examples.length > 0 && (
                  <div style={styles.aiResult}>
                    <h3>🤖 AI生成例文</h3>
                    {examples.map((ex, i) => (
                      <div key={i} style={styles.exampleItem}>
                        <p>{ex.sentence}</p>
                        <small>💡 {ex.situation}</small>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI解説 */}
                {explanation && (
                  <div style={styles.aiResult}>
                    <h3>📖 AI解説</h3>
                    <p><strong>簡単に:</strong> {explanation.simple}</p>
                    <p><strong>詳しく:</strong> {explanation.detailed}</p>
                    {explanation.history && (
                      <p><strong>由来:</strong> {explanation.history}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.complete}>
            <h1>🎉 全て学習完了！</h1>
            <p>おめでとうございます！</p>
          </div>
        )}
      </main>

      {/* デイリーミッション */}
      <aside style={styles.sidebar}>
        <h3>📋 今日のミッション</h3>
        {dailyMissions.map((mission) => (
          <div key={mission.id} style={styles.mission}>
            <p>{mission.description}</p>
            <p>{mission.progress.current}/{mission.target}</p>
            {mission.progress.completed && !mission.progress.claimedAt && (
              <button onClick={() => claimMission(mission.id)}>
                報酬を受け取る
              </button>
            )}
          </div>
        ))}
      </aside>

      {/* 実績通知 */}
      {pendingAchievements.length > 0 && (
        <div style={styles.achievementModal}>
          <div style={styles.achievementContent}>
            <h2>🏆 実績解除！</h2>
            <p style={styles.achievementIcon}>
              {pendingAchievements[0].icon}
            </p>
            <h3>{pendingAchievements[0].name}</h3>
            <p>{pendingAchievements[0].description}</p>
            <button 
              onClick={() => dismissAchievement(pendingAchievements[0].id)}
              style={styles.dismissButton}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
  },
  header: {
    marginBottom: '30px',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    fontSize: '18px',
    marginBottom: '10px',
  },
  expBar: {
    background: '#333',
    borderRadius: '10px',
    height: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  expFill: {
    background: 'linear-gradient(90deg, #4ade80, #22c55e)',
    height: '100%',
    transition: 'width 0.3s ease',
  },
  expText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  main: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
  },
  phrase: {
    fontSize: '36px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  reading: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: '20px',
  },
  meaning: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  example: {
    background: 'rgba(0,0,0,0.2)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  tags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  tag: {
    background: '#4f46e5',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  learnButton: {
    flex: 1,
    padding: '15px',
    fontSize: '18px',
    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  aiButton: {
    padding: '15px 20px',
    fontSize: '18px',
    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
  },
  aiSection: {
    marginTop: '20px',
    padding: '20px',
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '10px',
  },
  aiButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  aiActionButton: {
    flex: 1,
    padding: '10px',
    background: '#7c3aed',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
  },
  aiResult: {
    background: 'rgba(0,0,0,0.2)',
    padding: '15px',
    borderRadius: '10px',
    marginTop: '10px',
  },
  exampleItem: {
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  sidebar: {
    position: 'fixed',
    right: '20px',
    top: '20px',
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '15px',
    width: '250px',
  },
  mission: {
    padding: '10px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  complete: {
    textAlign: 'center',
    padding: '50px',
  },
  achievementModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  achievementContent: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  achievementIcon: {
    fontSize: '64px',
    margin: '20px 0',
  },
  dismissButton: {
    marginTop: '20px',
    padding: '12px 40px',
    fontSize: '16px',
    background: '#fff',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
  },
  navLink: {
    padding: '10px 20px',
    background: 'rgba(96, 165, 250, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  lockedCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
  },
  primaryButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '15px 40px',
    fontSize: '18px',
    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    borderRadius: '10px',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

