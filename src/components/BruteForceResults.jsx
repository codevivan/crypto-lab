/**
 * BruteForceResults Component
 * Displays the dynamic 26-row exhaustive search table.
 * Students can inspect every generated candidate plaintext and mark the meaningful one.
 */
export default function BruteForceResults({
  attempts,
  currentShift,
  isRunning,
  selectedShift,
  onSelectCandidate,
}) {
  return (
    <div className="brute-results-card">
      <div className="brute-results-header">
        <div>
          <h4>Exhaustive Key Space Table (Shifts 0 – 25)</h4>
          <p>
            Every possible Caesar shift is tested systematically. Inspect the candidate plaintexts below to identify the original message.
          </p>
        </div>
        <div className="results-counter-pill">
          {attempts.length} / 26 Shifts Evaluated
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="brute-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>Attempt</th>
              <th style={{ width: "85px" }}>Shift (K)</th>
              <th>Candidate Plaintext</th>
              <th style={{ width: "110px" }}>Status</th>
              <th style={{ width: "130px", textAlign: "center" }}>Analyst Action</th>
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-table-cell">
                  <div className="empty-table-state">
                    <span className="empty-icon">⏳</span>
                    <strong>No attack executed yet</strong>
                    <p>Click &ldquo;Start Attack&rdquo; above to sequentially decrypt through all 26 Caesar keys.</p>
                  </div>
                </td>
              </tr>
            ) : (
              attempts.map((attempt) => {
                const isCurrentlyTesting = isRunning && attempt.shift === currentShift;
                const isSelected = selectedShift === attempt.shift;

                let rowClass = "table-row";
                if (isCurrentlyTesting) rowClass += " row-testing";
                if (isSelected) rowClass += " row-selected";

                return (
                  <tr key={attempt.shift} className={rowClass}>
                    <td className="attempt-cell">#{attempt.attemptNum}</td>
                    <td className="shift-cell">
                      <span className="shift-tag">K = {attempt.shift}</span>
                    </td>
                    <td className="candidate-cell">
                      <code className="candidate-code">{attempt.candidate}</code>
                    </td>
                    <td className="status-cell">
                      {isCurrentlyTesting ? (
                        <span className="status-pill status-testing">
                          <span className="pulse-dot"></span> Testing
                        </span>
                      ) : isSelected ? (
                        <span className="status-pill status-matched">
                          ✓ Identified
                        </span>
                      ) : (
                        <span className="status-pill status-tested">
                          Tested
                        </span>
                      )}
                    </td>
                    <td className="action-cell" style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className={`candidate-select-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => onSelectCandidate(attempt.shift)}
                        title={`Mark Shift ${attempt.shift} as the recovered plaintext`}
                      >
                        {isSelected ? "★ Selected" : "Select Result"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
