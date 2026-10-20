import { useState, useMemo } from "react";
import { CONCEPTS_QUIZ } from "../data/concepts";

/**
 * ConceptQuiz Component
 * Exactly 10 challenging, university-level multiple-choice questions
 * covering all fundamental cryptography & cryptanalysis topics.
 *
 * Requirements fulfilled:
 * - Exactly 10 questions
 * - Visible question counter ("Question X of 10")
 * - 4 options per question, exactly one correct
 * - Clear selected-answer state
 * - Submit Answer button
 * - Immediate correctness feedback after submission
 * - Concise mathematical explanation of the correct answer
 * - Next Question button
 * - Progress indicator
 * - Final score out of 10
 * - Results summary showing correct and incorrect responses
 * - Retry Quiz button
 * - Locked on submission to prevent repeated attempts inflating score
 * - Award 1 point per correct first submission (max 10/10)
 */
export default function ConceptQuiz({
  onBackToConcepts,
  externalState,
  externalHandlers,
}) {
  const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);
  const [internalSelectedAnswers, setInternalSelectedAnswers] = useState({});
  const [internalSubmittedAnswers, setInternalSubmittedAnswers] = useState({});
  const [internalScores, setInternalScores] = useState({});
  const [internalShowResults, setInternalShowResults] = useState(false);

  const currentIndex =
    externalState?.currentIndex !== undefined
      ? externalState.currentIndex
      : internalCurrentIndex;
  const selectedAnswers =
    externalState?.selectedAnswers !== undefined
      ? externalState.selectedAnswers
      : internalSelectedAnswers;
  const submittedAnswers =
    externalState?.submittedAnswers !== undefined
      ? externalState.submittedAnswers
      : internalSubmittedAnswers;
  const scores =
    externalState?.scores !== undefined
      ? externalState.scores
      : internalScores;
  const showResults =
    externalState?.showResults !== undefined
      ? externalState.showResults
      : internalShowResults;

  const setCurrentIndex =
    externalHandlers?.setCurrentIndex || setInternalCurrentIndex;
  const setSelectedAnswers =
    externalHandlers?.setSelectedAnswers || setInternalSelectedAnswers;
  const setSubmittedAnswers =
    externalHandlers?.setSubmittedAnswers || setInternalSubmittedAnswers;
  const setScores =
    externalHandlers?.setScores || setInternalScores;
  const setShowResults =
    externalHandlers?.setShowResults || setInternalShowResults;

  const totalQuestions = CONCEPTS_QUIZ.length;
  const currentQuestion = CONCEPTS_QUIZ[currentIndex] || CONCEPTS_QUIZ[0];

  const submittedCount = useMemo(
    () => Object.keys(submittedAnswers).filter((k) => submittedAnswers[k]).length,
    [submittedAnswers]
  );

  const totalScore = useMemo(
    () => Object.values(scores).reduce((sum, val) => sum + (val || 0), 0),
    [scores]
  );

  const allSubmitted = submittedCount === totalQuestions;
  const progressPercent = Math.round((submittedCount / totalQuestions) * 100);

  // Handle option selection before submission
  const handleSelectOption = (qId, optionIdx) => {
    if (submittedAnswers[qId]) return; // locked
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  // Handle submitting response for the active question
  const handleSubmitAnswer = (qId) => {
    if (selectedAnswers[qId] === undefined || submittedAnswers[qId]) return;

    const question = CONCEPTS_QUIZ.find((q) => q.id === qId);
    if (!question) return;

    const isCorrect = selectedAnswers[qId] === question.answer;

    // Award 1 point on first attempt if correct, 0 if incorrect
    setScores((prev) => ({
      ...prev,
      [qId]: isCorrect ? 1 : 0,
    }));

    setSubmittedAnswers((prev) => ({
      ...prev,
      [qId]: true,
    }));
  };

  // Advance to next question
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // Go to previous question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Jump to specific question
  const handleJumpToQuestion = (idx) => {
    setCurrentIndex(idx);
    setShowResults(false);
  };

  // Retry quiz completely
  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setScores({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  const currentQId = currentQuestion.id;
  const currentSelected = selectedAnswers[currentQId];
  const isCurrentSubmitted = !!submittedAnswers[currentQId];
  const isCurrentCorrect = isCurrentSubmitted && currentSelected === currentQuestion.answer;

  return (
    <div className="concept-quiz-section university-quiz-assessment" id="concepts-quiz-container">
      {/* QUIZ TOP BAR */}
      <div className="quiz-header">
        <span className="quiz-header-icon">📝</span>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <strong>Laboratory Assessment Quiz</strong>
          <span className="quiz-subtitle">
            10 Challenging Cryptography &amp; Cryptanalysis Problems
          </span>
        </div>

        <div className="quiz-topbar-controls">
          <div
            className={`quiz-score-pill ${
              totalScore >= 8 ? "score-great" : totalScore >= 5 ? "score-ok" : "score-low"
            }`}
          >
            Score: {totalScore} / {totalQuestions}
          </div>

          {onBackToConcepts && (
            <button
              type="button"
              className="lab-btn secondary-btn small-btn"
              onClick={onBackToConcepts}
              title="Return to concept course notes"
            >
              ← Back to Concepts
            </button>
          )}
        </div>
      </div>

      {/* QUIZ PROGRESS TRACKER & QUESTION PILLS */}
      <div className="quiz-nav-strip">
        <div className="quiz-progress-meta">
          <span className="quiz-counter-text">
            <strong>Question {currentIndex + 1} of {totalQuestions}</strong>
            <span className="quiz-topic-badge">{currentQuestion.topic}</span>
          </span>
          <span className="quiz-answered-count">
            {submittedCount} of {totalQuestions} Answered ({progressPercent}%)
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-track-container" style={{ margin: "8px 0 12px" }}>
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%`, transition: "width 0.3s ease" }}
          ></div>
        </div>

        {/* QUESTION SELECTOR PILLS */}
        <div className="quiz-pills-row" role="tablist" aria-label="Question Navigator">
          {CONCEPTS_QUIZ.map((q, idx) => {
            const isSub = submittedAnswers[q.id];
            const isCor = isSub && selectedAnswers[q.id] === q.answer;
            const isCur = idx === currentIndex && !showResults;

            let pillClass = "quiz-pill";
            if (isCur) pillClass += " pill-current";
            if (isSub) {
              pillClass += isCor ? " pill-correct" : " pill-wrong";
            }

            return (
              <button
                key={q.id}
                type="button"
                className={pillClass}
                onClick={() => handleJumpToQuestion(idx)}
                title={`Q${idx + 1}: ${q.topic} ${isSub ? (isCor ? "(Correct)" : "(Incorrect)") : "(Unanswered)"}`}
                aria-label={`Go to Question ${idx + 1}`}
              >
                <span className="pill-q-num">{idx + 1}</span>
                {isSub && <span className="pill-status-dot">{isCor ? "✓" : "✗"}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS SUMMARY VIEW */}
      {showResults ? (
        <div className="quiz-results-view">
          <div className="quiz-results-hero">
            <div className="results-icon">🏆</div>
            <h3>Assessment Completed</h3>
            <div className="results-big-score">
              Final Score: <strong>{totalScore}</strong> / {totalQuestions} ({totalScore * 10}%)
            </div>

            <p className="results-feedback-text">
              {totalScore === 10 && (
                <span className="feedback-master">
                  🌟 Outstanding! Perfect 10/10 score. You have mastered classical ciphers, modular arithmetic, and cryptanalysis strategies!
                </span>
              )}
              {totalScore >= 7 && totalScore < 10 && (
                <span className="feedback-good">
                  👍 Great performance ({totalScore}/10)! Review the detailed solutions below for the questions you missed.
                </span>
              )}
              {totalScore >= 5 && totalScore < 7 && (
                <span className="feedback-average">
                  📖 Satisfactory attempt ({totalScore}/10). Revisit the modular arithmetic and mapping constraints concepts before retrying.
                </span>
              )}
              {totalScore < 5 && (
                <span className="feedback-low">
                  ⚠️ Score: {totalScore}/10. Please study the Concepts section carefully and review the explanations below before your next attempt.
                </span>
              )}
            </p>

            <div className="results-stats-row">
              <div className="res-stat-card stat-correct">
                <span className="stat-label">Correct</span>
                <strong className="stat-value">{totalScore}</strong>
              </div>
              <div className="res-stat-card stat-wrong">
                <span className="stat-label">Incorrect</span>
                <strong className="stat-value">{totalQuestions - totalScore}</strong>
              </div>
              <div className="res-stat-card stat-total">
                <span className="stat-label">Total Questions</span>
                <strong className="stat-value">{totalQuestions}</strong>
              </div>
            </div>

            <div className="results-action-buttons">
              <button
                type="button"
                className="lab-btn primary-btn"
                onClick={handleRetry}
              >
                ↺ Retry Quiz
              </button>
              <button
                type="button"
                className="lab-btn secondary-btn"
                onClick={() => {
                  setShowResults(false);
                  setCurrentIndex(0);
                }}
              >
                Review Question Cards →
              </button>
            </div>
          </div>

          {/* DETAILED QUESTION BREAKDOWN TABLE / CARDS */}
          <div className="quiz-summary-review-list">
            <h4>Question Breakdown &amp; Solutions</h4>
            {CONCEPTS_QUIZ.map((q, qIdx) => {
              const selected = selectedAnswers[q.id];
              const submitted = submittedAnswers[q.id];
              const isCorrect = submitted && selected === q.answer;

              return (
                <div
                  key={q.id}
                  className={`quiz-summary-card ${submitted ? (isCorrect ? "q-correct" : "q-wrong") : "q-unanswered"}`}
                >
                  <div className="summary-card-header">
                    <span className="quiz-q-num">Q{qIdx + 1}</span>
                    <strong className="summary-topic">{q.topic}</strong>
                    <span className={`summary-badge ${isCorrect ? "badge-correct" : "badge-wrong"}`}>
                      {isCorrect ? "✓ Correct (+1 pt)" : "✗ Incorrect (0 pts)"}
                    </span>
                  </div>

                  <p className="summary-q-text">{q.question}</p>

                  <div className="summary-answers-row">
                    <div className="summary-user-choice">
                      <span>Your Answer:</span>{" "}
                      <strong>
                        {selected !== undefined
                          ? `${String.fromCharCode(65 + selected)}) ${q.options[selected]}`
                          : "Not answered"}
                      </strong>
                    </div>

                    {!isCorrect && (
                      <div className="summary-correct-choice">
                        <span>Correct Answer:</span>{" "}
                        <strong>
                          {String.fromCharCode(65 + q.answer)}) {q.options[q.answer]}
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="quiz-explanation explanation-correct" style={{ marginTop: "10px" }}>
                    <span>Mathematical Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION CARD */
        <div className="quiz-active-card-container">
          <div
            className={`quiz-question-card ${
              isCurrentSubmitted ? (isCurrentCorrect ? "q-correct" : "q-wrong") : ""
            }`}
          >
            <div className="quiz-question-header">
              <span className="quiz-q-num">Q{currentIndex + 1}</span>
              <div>
                <p className="quiz-q-text">{currentQuestion.question}</p>
              </div>
            </div>

            {/* FOUR ANSWER OPTIONS */}
            <div className="quiz-options" role="radiogroup" aria-label={`Question ${currentIndex + 1} options`}>
              {currentQuestion.options.map((opt, optIdx) => {
                let optClass = "quiz-option";
                if (isCurrentSubmitted) {
                  if (optIdx === currentQuestion.answer) {
                    optClass += " opt-correct";
                  } else if (optIdx === currentSelected && !isCurrentCorrect) {
                    optClass += " opt-wrong";
                  }
                } else if (currentSelected === optIdx) {
                  optClass += " opt-selected";
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    className={optClass}
                    onClick={() => handleSelectOption(currentQId, optIdx)}
                    disabled={isCurrentSubmitted}
                    role="radio"
                    aria-checked={currentSelected === optIdx}
                    aria-label={`Option ${String.fromCharCode(65 + optIdx)}: ${opt}`}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                    <span className="opt-text">{opt}</span>
                    {isCurrentSubmitted && optIdx === currentQuestion.answer && (
                      <span className="opt-check">✓</span>
                    )}
                    {isCurrentSubmitted && optIdx === currentSelected && !isCurrentCorrect && (
                      <span className="opt-x">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* SUBMIT BUTTON (LOCKED AFTER SUBMISSION) */}
            {!isCurrentSubmitted && (
              <div className="quiz-submit-strip">
                <button
                  type="button"
                  className="lab-btn primary-btn quiz-submit-btn"
                  onClick={() => handleSubmitAnswer(currentQId)}
                  disabled={currentSelected === undefined}
                >
                  Submit Answer
                </button>
                {currentSelected === undefined && (
                  <span className="quiz-submit-hint">Select an option above to submit your response.</span>
                )}
              </div>
            )}

            {/* IMMEDIATE CORRECTNESS FEEDBACK & EXPLANATION */}
            {isCurrentSubmitted && (
              <div
                className={`quiz-explanation ${
                  isCurrentCorrect ? "explanation-correct" : "explanation-wrong"
                }`}
              >
                <span>{isCurrentCorrect ? "✓ Correct! (+1 point)" : "✗ Incorrect (0 points)"}</span>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* QUESTION NAVIGATION CONTROLS */}
          <div className="quiz-nav-controls-row">
            <button
              type="button"
              className="lab-btn secondary-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ← Previous Question
            </button>

            <div className="quiz-step-indicator">
              Question {currentIndex + 1} of {totalQuestions}
            </div>

            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                className="lab-btn primary-btn"
                onClick={handleNext}
              >
                Next Question →
              </button>
            ) : (
              <button
                type="button"
                className="lab-btn primary-btn finish-btn"
                onClick={() => setShowResults(true)}
              >
                {allSubmitted ? "View Final Results →" : "View Results Summary →"}
              </button>
            )}
          </div>

          {allSubmitted && (
            <div className="quiz-all-done-banner">
              <span>All 10 questions answered! You can review above or view your final assessment report.</span>
              <button
                type="button"
                className="lab-btn primary-btn small-btn"
                onClick={() => setShowResults(true)}
              >
                View Final Score ({totalScore}/10) →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
