/**
 * FeedbackPanel Component
 * Displays submission outcome (Success / Incorrect) with points earned,
 * explanations, and action triggers.
 */
export default function FeedbackPanel({
  feedback,
  onTryAgain,
  onNextChallenge,
  hasNextChallenge,
}) {
  if (!feedback) return null;

  const isSuccess = feedback.status === "correct";

  return (
    <div className={`feedback-panel ${isSuccess ? "feedback-success" : "feedback-error"}`}>
      <div className="feedback-header">
        <div className="feedback-title-group">
          <span className="feedback-icon">{isSuccess ? "🎉" : "🔍"}</span>
          <div>
            <h4>{isSuccess ? "Correct! Challenge Solved" : "Not Quite — Keep Investigating"}</h4>
            <p>{feedback.message}</p>
          </div>
        </div>
        {isSuccess && (
          <div className="earned-points-badge">
            +{feedback.pointsEarned} Points Earned
          </div>
        )}
      </div>

      {isSuccess ? (
        <div className="feedback-success-body">
          <div className="success-recap-row">
            <div>
              <span className="recap-label">RECOVERED PLAINTEXT</span>
              <strong className="recap-text">{feedback.recoveredText}</strong>
            </div>
            {feedback.shift !== undefined && feedback.shift !== null && (
              <div>
                <span className="recap-label">IDENTIFIED KEY</span>
                <strong className="recap-text">Caesar Shift K = {feedback.shift}</strong>
              </div>
            )}
          </div>

          <div className="explanation-box">
            <strong>💡 Cryptanalysis Insight:</strong>
            <p>{feedback.explanation}</p>
          </div>

          <div className="feedback-actions">
            {hasNextChallenge ? (
              <button
                type="button"
                className="lab-btn primary-btn"
                onClick={onNextChallenge}
              >
                Next Challenge ➔
              </button>
            ) : (
              <span className="all-completed-pill">🏆 All 5 Challenges Solved!</span>
            )}
          </div>
        </div>
      ) : (
        <div className="feedback-actions">
          <button
            type="button"
            className="lab-btn secondary-btn"
            onClick={onTryAgain}
          >
            ↺ Try Again
          </button>
        </div>
      )}
    </div>
  );
}
