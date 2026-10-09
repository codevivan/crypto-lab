/**
 * ChallengeCard Component
 * Displays a single challenge summary card with difficulty, tags, points, and completion badge.
 */
export default function ChallengeCard({
  challenge,
  isActive,
  isCompleted,
  onSelect,
}) {
  return (
    <div
      className={`practice-challenge-card ${isActive ? "active-challenge" : ""} ${
        isCompleted ? "completed-challenge" : ""
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect();
        }
      }}
    >
      <div className="card-top-row">
        <span className="challenge-index">Challenge 0{challenge.id}</span>
        {isCompleted ? (
          <span className="completed-badge">✓ Completed</span>
        ) : (
          <span className={`diff-badge diff-${challenge.difficulty.toLowerCase().replace(/[^a-z]/g, "")}`}>
            {challenge.difficulty}
          </span>
        )}
      </div>

      <h4 className="challenge-title">{challenge.title}</h4>

      <div className="challenge-meta-tags">
        <span className="meta-tag">{challenge.cipherType}</span>
        <span className="meta-tag attack-tag">{challenge.attackType}</span>
      </div>

      <div className="card-footer-row">
        <span className="points-label">{challenge.points} pts</span>
        <span className="select-prompt">{isActive ? "Current ➔" : "Start Lab ➔"}</span>
      </div>
    </div>
  );
}
