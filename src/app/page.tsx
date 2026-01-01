'use client';

import { useState, useEffect } from 'react';
import { usePhraselearning, useAILearning, Phrase, useVocabularyLearning, getPhraseCategory } from '../';
import phrasesData from '../data/phrases.json';
import Link from 'next/link';

// meaningCategoryが存在しない場合は自動的に設定
const phrases = (phrasesData as Phrase[]).map(phrase => ({
  ...phrase,
  meaningCategory: phrase.meaningCategory || getPhraseCategory(phrase.id),
}));

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
    lastResult,
    isAllLearned,
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
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Hooksは条件分岐の前に呼び出す必要がある
  const vocabState = useVocabularyLearning();
  const isProverbsUnlocked = vocabState.state.rankProgress.highestUnlockedRank >= 10;

  // レベルアップを検出
  useEffect(() => {
    if (lastResult?.experienceResult?.leveledUp) {
      setLevelUpData({
        oldLevel: userState.level - 1,
        newLevel: lastResult.experienceResult.newLevel,
      });
      setShowLevelUp(true);
    }
  }, [lastResult, userState.level]);

  // 全て学習完了を検出
  useEffect(() => {
    if (isAllLearned && !isLoading) {
      setShowCompletionModal(true);
    }
  }, [isAllLearned, isLoading]);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <p>読み込み中...</p>
      </div>
    );
  }

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
            <p style={styles.missionDescription}>{mission.description}</p>
            <div style={styles.missionProgressBar}>
              <div
                style={{
                  ...styles.missionProgressFill,
                  width: `${Math.min((mission.progress.current / mission.target) * 100, 100)}%`,
                }}
              />
            </div>
            <p style={styles.missionProgressText}>
              {mission.progress.current}/{mission.target}
            </p>
            {mission.progress.completed && !mission.progress.claimedAt && (
              <button onClick={() => claimMission(mission.id)} style={styles.missionClaimButton}>
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

      {/* レベルアップモーダル */}
      {showLevelUp && levelUpData && (
        <LevelUpModal 
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {/* 全て学習完了モーダル */}
      {showCompletionModal && (
        <CompletionModal 
          userState={userState}
          progress={progress}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
}

// 全て学習完了モーダルコンポーネント
function CompletionModal({
  userState,
  progress,
  onClose,
}: {
  userState: any;
  progress: any;
  onClose: () => void;
}) {
  const [animationStage, setAnimationStage] = useState<'entering' | 'showing' | 'exiting'>('entering');
  const [showParticles, setShowParticles] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setTimeout(() => setAnimationStage('showing'), 400);
    setTimeout(() => setShowParticles(false), 5000);
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  const handleClose = () => {
    setAnimationStage('exiting');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div 
      style={{
        ...styles.completionOverlay,
        opacity: animationStage === 'exiting' ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* 紙吹雪エフェクト */}
      {showConfetti && (
        <div style={styles.confettiContainer}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.confetti,
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                background: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'][Math.floor(Math.random() * 6)],
              }}
            />
          ))}
        </div>
      )}

      {/* パーティクルエフェクト */}
      {showParticles && (
        <div style={styles.particlesContainer}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.particle,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                fontSize: `${20 + Math.random() * 20}px`,
              }}
            >
              {['🎉', '✨', '🌟', '⭐', '💫', '🎊'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div 
        style={{
          ...styles.completionModal,
          transform: animationStage === 'entering' 
            ? 'scale(0.3) rotate(-15deg)' 
            : animationStage === 'exiting'
            ? 'scale(0.7) rotate(10deg)'
            : 'scale(1) rotate(0deg)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* 複数の光るエフェクト */}
        <div style={styles.glowEffect} />
        <div style={{...styles.glowEffect, animationDelay: '0.5s'}} />
        <div style={{...styles.glowEffect, animationDelay: '1s'}} />
        
        <div style={styles.completionContent}>
          <div style={styles.completionIcon}>🏆</div>
          
          <h1 style={styles.completionTitle}>
            全て学習完了！
          </h1>
          
          <div style={styles.completionSubtitle}>
            おめでとうございます！
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>⭐</div>
              <div style={styles.statValue}>Lv.{userState.level}</div>
              <div style={styles.statLabel}>現在のレベル</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>📚</div>
              <div style={styles.statValue}>{progress.learnedCount}</div>
              <div style={styles.statLabel}>学習したフレーズ</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🔥</div>
              <div style={styles.statValue}>{userState.streak}</div>
              <div style={styles.statLabel}>連続学習日数</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>💎</div>
              <div style={styles.statValue}>{userState.totalExp}</div>
              <div style={styles.statLabel}>総獲得経験値</div>
            </div>
          </div>

          <div style={styles.congratulationsMessage}>
            <p style={styles.messageText}>
              あなたの努力と継続が素晴らしい成果を生み出しました！
            </p>
            <p style={styles.messageSubtext}>
              全てのことわざをマスターしたあなたは、真の日本語学習者です。
            </p>
            <p style={styles.messageSubtext}>
              この達成を誇りに思い、これからも日本語学習を楽しんでください！
            </p>
          </div>

          <div style={styles.celebrationEmojis}>
            🎉🎊🎈🎁🏆⭐✨🌟💫🎯
          </div>

          <button 
            onClick={handleClose}
            style={styles.completionButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.6)';
            }}
          >
            🎊 素晴らしい！
          </button>
        </div>
      </div>
    </div>
  );
}

// レベルアップモーダルコンポーネント
function LevelUpModal({ 
  oldLevel, 
  newLevel, 
  onClose 
}: { 
  oldLevel: number; 
  newLevel: number; 
  onClose: () => void;
}) {
  const [animationStage, setAnimationStage] = useState<'entering' | 'showing' | 'exiting'>('entering');
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    // エントランスアニメーション
    setTimeout(() => setAnimationStage('showing'), 300);
    // パーティクルを3秒後に消す
    setTimeout(() => setShowParticles(false), 3000);
  }, []);

  const handleClose = () => {
    setAnimationStage('exiting');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div 
      style={{
        ...styles.levelUpOverlay,
        opacity: animationStage === 'exiting' ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* パーティクルエフェクト */}
      {showParticles && (
        <div style={styles.particlesContainer}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.particle,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div 
        style={{
          ...styles.levelUpModal,
          transform: animationStage === 'entering' 
            ? 'scale(0.5) rotate(-10deg)' 
            : animationStage === 'exiting'
            ? 'scale(0.8) rotate(5deg)'
            : 'scale(1) rotate(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* 光るエフェクト */}
        <div style={styles.glowEffect} />
        
        <div style={styles.levelUpContent}>
          <div style={styles.levelUpIcon}>🎉</div>
          
          <h1 style={styles.levelUpTitle}>
            レベルアップ！
          </h1>
          
          <div style={styles.levelTransition}>
            <div style={styles.oldLevel}>Lv.{oldLevel}</div>
            <div style={styles.arrow}>→</div>
            <div style={styles.newLevel}>Lv.{newLevel}</div>
          </div>

          <div style={styles.congratulations}>
            <p style={styles.congratsText}>
              素晴らしい努力です！
            </p>
            <p style={styles.congratsSubtext}>
              あなたの継続的な学習が実を結びました
            </p>
            <p style={styles.congratsSubtext}>
              次のレベルでも頑張りましょう！
            </p>
          </div>

          <button 
            onClick={handleClose}
            style={styles.levelUpButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(34, 197, 94, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(34, 197, 94, 0.4)';
            }}
          >
            続ける
          </button>
        </div>
      </div>
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
    top: '200px',  // プログレスバーとヘッダーより十分下に配置
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '15px',
    width: '250px',
    maxHeight: 'calc(100vh - 220px)',
    overflowY: 'auto',
  },
  mission: {
    padding: '15px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  missionDescription: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  missionProgressBar: {
    background: '#333',
    borderRadius: '5px',
    height: '8px',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  missionProgressFill: {
    background: 'linear-gradient(90deg, #4ade80, #22c55e)',
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '5px',
  },
  missionProgressText: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    color: '#aaa',
    textAlign: 'right',
  },
  missionClaimButton: {
    width: '100%',
    padding: '8px',
    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
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
  // レベルアップモーダル
  levelUpOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(10px)',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    fontSize: '24px',
    animation: 'float 3s ease-in-out infinite',
    pointerEvents: 'none',
  },
  levelUpModal: {
    position: 'relative',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    borderRadius: '30px',
    padding: '50px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(59, 130, 246, 0.5)',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    animation: 'rotate 3s linear infinite',
    pointerEvents: 'none',
  },
  levelUpContent: {
    position: 'relative',
    zIndex: 1,
  },
  levelUpIcon: {
    fontSize: '80px',
    marginBottom: '20px',
    animation: 'bounce 1s ease-in-out infinite',
  },
  levelUpTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
    color: '#fff',
  },
  levelTransition: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    fontSize: '32px',
    fontWeight: 'bold',
  },
  oldLevel: {
    padding: '15px 30px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },
  arrow: {
    fontSize: '40px',
    color: '#fbbf24',
    textShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
  },
  newLevel: {
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    borderRadius: '15px',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  congratulations: {
    marginBottom: '30px',
  },
  congratsText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#fbbf24',
    textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
  },
  congratsSubtext: {
    fontSize: '16px',
    marginBottom: '10px',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.6',
  },
  levelUpButton: {
    padding: '15px 40px',
    fontSize: '20px',
    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
    border: 'none',
    borderRadius: '15px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 5px 20px rgba(34, 197, 94, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  // 全て学習完了モーダル
  completionOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
    backdropFilter: 'blur(15px)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    animation: 'confettiFall 4s linear infinite',
    borderRadius: '2px',
  },
  completionModal: {
    position: 'relative',
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 25%, #fcd34d 50%, #fbbf24 75%, #f59e0b 100%)',
    borderRadius: 'clamp(20px, 4vw, 40px)',
    padding: 'clamp(20px, 5vw, 60px)',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 150px rgba(251, 191, 36, 0.7)',
    border: 'clamp(2px, 0.5vw, 4px) solid rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  completionContent: {
    position: 'relative',
    zIndex: 1,
    padding: '0',
    boxSizing: 'border-box',
  },
  completionIcon: {
    fontSize: 'clamp(60px, 12vw, 120px)',
    marginBottom: 'clamp(10px, 2vw, 20px)',
    animation: 'bounce 1.2s ease-in-out infinite',
    filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
  },
  completionTitle: {
    fontSize: 'clamp(28px, 6vw, 56px)',
    fontWeight: 'bold',
    marginBottom: 'clamp(10px, 2vw, 15px)',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(251, 191, 36, 0.8)',
    color: '#fff',
    animation: 'pulse 2s ease-in-out infinite',
    lineHeight: '1.2',
  },
  completionSubtitle: {
    fontSize: 'clamp(18px, 4vw, 28px)',
    marginBottom: 'clamp(20px, 4vw, 40px)',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    lineHeight: '1.4',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 'clamp(10px, 2vw, 20px)',
    marginBottom: 'clamp(20px, 4vw, 40px)',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    borderRadius: 'clamp(15px, 3vw, 20px)',
    padding: 'clamp(15px, 3vw, 25px)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
    minWidth: '0',
  },
  statIcon: {
    fontSize: 'clamp(30px, 6vw, 40px)',
    marginBottom: 'clamp(5px, 1vw, 10px)',
  },
  statValue: {
    fontSize: 'clamp(24px, 5vw, 32px)',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '5px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    wordBreak: 'break-word',
  },
  statLabel: {
    fontSize: 'clamp(11px, 2vw, 14px)',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    lineHeight: '1.3',
  },
  congratulationsMessage: {
    marginBottom: 'clamp(20px, 4vw, 30px)',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: 'clamp(15px, 3vw, 20px)',
    padding: 'clamp(20px, 4vw, 30px)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },
  messageText: {
    fontSize: 'clamp(16px, 3.5vw, 22px)',
    fontWeight: 'bold',
    marginBottom: 'clamp(10px, 2vw, 15px)',
    color: '#fff',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    lineHeight: '1.6',
  },
  messageSubtext: {
    fontSize: 'clamp(13px, 2.5vw, 16px)',
    marginBottom: 'clamp(8px, 1.5vw, 10px)',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: '1.8',
  },
  celebrationEmojis: {
    fontSize: 'clamp(20px, 4vw, 36px)',
    marginBottom: 'clamp(20px, 4vw, 30px)',
    letterSpacing: 'clamp(5px, 1vw, 10px)',
    animation: 'rotate 3s linear infinite',
    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  completionButton: {
    padding: 'clamp(15px, 3vw, 20px) clamp(30px, 6vw, 50px)',
    fontSize: 'clamp(18px, 3.5vw, 24px)',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    border: '3px solid rgba(255, 255, 255, 0.6)',
    borderRadius: 'clamp(15px, 3vw, 20px)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.6)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
  },
};

// CSSアニメーション（グローバルスタイルとして追加）
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: translateY(-100px) rotate(180deg);
        opacity: 0.5;
      }
    }
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 50px rgba(251, 191, 36, 0.8);
      }
    }
    @keyframes confettiFall {
      0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  if (!document.head.querySelector('style[data-animations]')) {
    style.setAttribute('data-animations', 'true');
    document.head.appendChild(style);
  }
}

