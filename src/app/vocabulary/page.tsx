'use client';

import { useState } from 'react';
import { useVocabularyLearning, useQuiz } from '../../';
import Link from 'next/link';
import Image from 'next/image';

// 画像URLかどうかを判定
function isImageUrl(str: string): boolean {
  return str.startsWith('/') || str.startsWith('http://') || str.startsWith('https://');
}

export default function VocabularyPage() {
  const {
    currentItem,
    currentRankInfo,
    progress,
    canTakeQuiz,
    markAsLearned,
    nextItem,
    changeRank,
    allRanks,
    state,
    reloadState,
  } = useVocabularyLearning();

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  const {
    session,
    currentQuestion,
    result,
    selectedAnswer,
    showResult,
    quizProgress,
    startQuiz,
    submitAnswer,
    resetQuiz,
  } = useQuiz(state.rankProgress.currentRank, (result) => {
    setQuizResult(result);
    // クイズ完了後、状態を再読み込みしてランクアンロックを反映
    reloadState();
  });

  // クイズ開始
  const handleStartQuiz = () => {
    if (!canTakeQuiz) return;
    startQuiz();
    setShowQuiz(true);
    setQuizResult(null);
  };

  // クイズ終了
  const handleQuizComplete = () => {
    setShowQuiz(false);
    resetQuiz();
  };

  if (showQuiz && session) {
    return (
      <div style={styles.container}>
        <div style={styles.quizContainer}>
          {/* クイズヘッダー */}
          <div style={styles.quizHeader}>
            <button onClick={handleQuizComplete} style={styles.backButton}>
              ← 戻る
            </button>
            <h2>クイズ: {currentRankInfo?.name}</h2>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(quizProgress.current / quizProgress.total) * 100}%`,
                }}
              />
              <span style={styles.progressText}>
                {quizProgress.current} / {quizProgress.total}
              </span>
            </div>
          </div>

          {/* クイズ結果表示 */}
          {result ? (
            <div style={styles.resultContainer}>
              <h1 style={styles.resultTitle}>
                {result.passed ? '🎉 合格！' : '😢 不合格'}
              </h1>
              <div style={styles.resultStats}>
                <p>正解: {result.correctAnswers} / {result.totalQuestions}</p>
                <p>スコア: {result.score}%</p>
                <p>獲得EXP: +{result.expEarned}</p>
                {result.newRankUnlocked && (
                  <div style={styles.unlockMessage}>
                    🎊 次のランクが解放されました！
                  </div>
                )}
              </div>
              <button onClick={handleQuizComplete} style={styles.continueButton}>
                続ける
              </button>
            </div>
          ) : currentQuestion ? (
            <div style={styles.questionContainer}>
              <h3 style={styles.questionText}>{currentQuestion.question}</h3>

              {/* 画像表示（image_to_word または word_to_image） */}
              {currentQuestion.image && (
                <div style={styles.imageContainer}>
                  {isImageUrl(currentQuestion.image) ? (
                    <Image
                      src={currentQuestion.image}
                      alt="Question image"
                      width={150}
                      height={150}
                      style={styles.quizImage}
                    />
                  ) : (
                    <div style={styles.imageBox}>{currentQuestion.image}</div>
                  )}
                </div>
              )}

              {/* 選択肢 */}
              <div style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const showFeedback = showResult;
                  const isImageOption = isImageUrl(option);

                  let buttonStyle = styles.optionButton;
                  if (showFeedback) {
                    if (isCorrect) {
                      buttonStyle = { ...buttonStyle, ...styles.correctButton };
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = { ...buttonStyle, ...styles.wrongButton };
                    }
                  } else if (isSelected) {
                    buttonStyle = { ...buttonStyle, ...styles.selectedButton };
                  }

                  return (
                    <button
                      key={index}
                      style={buttonStyle}
                      onClick={() => !showResult && submitAnswer(option)}
                      disabled={showResult}
                    >
                      {isImageOption ? (
                        <div style={styles.optionImageContainer}>
                          {isImageUrl(option) ? (
                            <Image
                              src={option}
                              alt="Option"
                              width={100}
                              height={100}
                              style={styles.optionImage}
                            />
                          ) : (
                            <div style={styles.optionImageBox}>{option}</div>
                          )}
                          {showFeedback && isCorrect && (
                            <span style={styles.correctMark}>✓</span>
                          )}
                        </div>
                      ) : (
                        <>
                          {option}
                          {showFeedback && isCorrect && ' ✓'}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>クイズを生成中...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <header style={styles.header}>
        <Link href="/" style={styles.homeLink}>← ホーム</Link>
        <h1 style={styles.title}>📚 ボキャブラリー学習</h1>
      </header>

      {/* ランク選択 */}
      <div style={styles.rankSelector}>
        <h3>ランク選択</h3>
        <div style={styles.ranksGrid}>
          {allRanks.map((rank) => {
            const isUnlocked = rank.level <= state.rankProgress.highestUnlockedRank;
            const isCurrent = rank.level === state.rankProgress.currentRank;
            const score = state.rankProgress.rankScores[rank.level] || 0;

            return (
              <button
                key={rank.level}
                style={{
                  ...styles.rankCard,
                  opacity: isUnlocked ? 1 : 0.5,
                  border: isCurrent ? `3px solid ${rank.color}` : 'none',
                  background: isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
                }}
                onClick={() => isUnlocked && changeRank(rank.level)}
                disabled={!isUnlocked}
              >
                <div style={styles.rankIcon}>{rank.icon}</div>
                <div style={styles.rankName}>{rank.name}</div>
                <div style={styles.rankLevel}>Lv.{rank.level}</div>
                {score > 0 && (
                  <div style={styles.rankScore}>最高: {score}%</div>
                )}
                {!isUnlocked && (
                  <div style={styles.lockedLabel}>🔒 ロック</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* メインコンテンツ */}
      <main style={styles.main}>
        {currentRankInfo && (
          <div style={styles.rankInfo}>
            <h2>
              {currentRankInfo.icon} {currentRankInfo.name}
            </h2>
            <p>{currentRankInfo.description}</p>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress.percentage}%`,
                  background: currentRankInfo.color,
                }}
              />
              <span style={styles.progressText}>
                {progress.learned} / {progress.total} 学習済み
              </span>
            </div>
          </div>
        )}

        {/* 現在の単語 */}
        {currentItem ? (
          <div style={styles.card}>
            <div style={styles.imageDisplay}>
              {isImageUrl(currentItem.image) ? (
                <Image
                  src={currentItem.image}
                  alt={currentItem.word}
                  width={200}
                  height={200}
                  style={styles.image}
                />
              ) : (
                <div style={styles.largeImage}>{currentItem.image}</div>
              )}
            </div>
            <h1 style={styles.word}>{currentItem.word}</h1>
            <p style={styles.reading}>{currentItem.reading}</p>
            <p style={styles.meaning}>{currentItem.meaning}</p>

            <div style={styles.actions}>
              <button
                style={styles.learnButton}
                onClick={() => markAsLearned(currentItem.id)}
              >
                ✅ 覚えた！
              </button>
              <button style={styles.skipButton} onClick={nextItem}>
                ⏭️ スキップ
              </button>
            </div>
          </div>
        ) : progress.total === 0 ? (
          <div style={styles.completeCard}>
            <h2>📝 準備中</h2>
            <p>このランクにはまだ単語が登録されていません。</p>
          </div>
        ) : (
          <div style={styles.completeCard}>
            <h2>🎉 全て学習完了！</h2>
            <p>このランクの全ての単語を学習しました。</p>
            {canTakeQuiz ? (
              <button 
                style={styles.quizButton} 
                onClick={handleStartQuiz}
                disabled={!canTakeQuiz}
              >
                📝 クイズに挑戦
              </button>
            ) : (
              <p style={styles.hint}>
                全ての単語を学習してからクイズに挑戦できます。
              </p>
            )}
          </div>
        )}
      </main>
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
  homeLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    marginBottom: '10px',
    display: 'inline-block',
  },
  title: {
    fontSize: '32px',
    margin: '10px 0',
  },
  rankSelector: {
    marginBottom: '30px',
  },
  ranksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  rankCard: {
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '2px solid rgba(255,255,255,0.1)',
  },
  rankIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  rankName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  rankLevel: {
    fontSize: '12px',
    color: '#aaa',
  },
  rankScore: {
    fontSize: '11px',
    color: '#4ade80',
    marginTop: '5px',
  },
  lockedLabel: {
    fontSize: '12px',
    color: '#fbbf24',
    marginTop: '5px',
  },
  main: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  rankInfo: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  progressBar: {
    background: '#333',
    borderRadius: '10px',
    height: '24px',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '10px',
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  imageDisplay: {
    marginBottom: '30px',
  },
  largeImage: {
    fontSize: '120px',
    margin: '0 auto',
  },
  image: {
    borderRadius: '15px',
    objectFit: 'cover',
  },
  quizImage: {
    borderRadius: '10px',
    objectFit: 'cover',
  },
  word: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  reading: {
    fontSize: '24px',
    color: '#aaa',
    marginBottom: '15px',
  },
  meaning: {
    fontSize: '20px',
    marginBottom: '30px',
  },
  actions: {
    display: 'flex',
    gap: '15px',
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
  skipButton: {
    padding: '15px 20px',
    fontSize: '18px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
  },
  completeCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
  },
  quizButton: {
    marginTop: '20px',
    padding: '15px 40px',
    fontSize: '18px',
    background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  hint: {
    marginTop: '20px',
    color: '#aaa',
  },
  quizContainer: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  quizHeader: {
    marginBottom: '30px',
  },
  backButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  questionContainer: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
  },
  questionText: {
    fontSize: '24px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  imageBox: {
    fontSize: '100px',
    display: 'inline-block',
  },
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  optionButton: {
    padding: '20px',
    fontSize: '18px',
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    background: 'rgba(96, 165, 250, 0.3)',
    borderColor: '#60a5fa',
  },
  correctButton: {
    background: 'rgba(34, 197, 94, 0.3)',
    borderColor: '#22c55e',
  },
  wrongButton: {
    background: 'rgba(239, 68, 68, 0.3)',
    borderColor: '#ef4444',
  },
  optionImageContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    minHeight: '80px',
  },
  optionImage: {
    borderRadius: '8px',
    objectFit: 'contain',
    width: '100px',
    height: '100px',
    maxWidth: '100%',
    maxHeight: '100px',
  },
  optionImageBox: {
    fontSize: '80px',
    display: 'inline-block',
    lineHeight: '1',
  },
  correctMark: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize: '24px',
    color: '#22c55e',
    fontWeight: 'bold',
    background: 'rgba(0,0,0,0.7)',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  resultStats: {
    fontSize: '20px',
    marginBottom: '30px',
  },
  unlockMessage: {
    fontSize: '18px',
    color: '#fbbf24',
    marginTop: '20px',
    fontWeight: 'bold',
  },
  continueButton: {
    padding: '15px 40px',
    fontSize: '18px',
    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

