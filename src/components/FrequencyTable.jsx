import { ENGLISH_LETTERS_BY_FREQUENCY } from "../crypto/analysis";

/**
 * FrequencyTable Component
 * Shows tabular view of frequencies ranked descending by occurrence count,
 * showing possible English letter hypotheses.
 */
export default function FrequencyTable({
  sortedFrequencies,
  mapping,
  onApplyHypothesis,
}) {
  return (
    <div className="frequency-table-card">
      <div className="table-card-header">
        <div>
          <h4>Ranked Frequency & Hypotheses Table</h4>
          <p>
            Sorted from most frequent to least frequent ciphertext letters. Hypotheses are based on standard English ETAOIN order.
          </p>
        </div>
        <span className="results-counter-pill">
          26 Letters Analyzed
        </span>
      </div>

      <div className="table-responsive-wrapper">
        <table className="brute-table">
          <thead>
            <tr>
              <th style={{ width: "65px" }}>Rank</th>
              <th style={{ width: "80px" }}>Cipher</th>
              <th style={{ width: "80px" }}>Count</th>
              <th style={{ width: "100px" }}>Cipher %</th>
              <th style={{ width: "105px" }}>English %</th>
              <th>Possible Hypothesis</th>
              <th style={{ width: "140px", textAlign: "center" }}>Current Mapping</th>
            </tr>
          </thead>
          <tbody>
            {sortedFrequencies.map((item, index) => {
              const rank = index + 1;
              const expectedLetter = ENGLISH_LETTERS_BY_FREQUENCY[index];
              const currentPlain = mapping[item.letter] || null;
              const isAssigned = currentPlain !== null;

              return (
                <tr key={item.letter} className="table-row">
                  <td className="attempt-cell">#{rank}</td>
                  <td className="shift-cell">
                    <span className="cipher-letter-chip">{item.letter}</span>
                  </td>
                  <td><strong>{item.count}</strong></td>
                  <td>
                    <span className="percent-val">{item.percentage}%</span>
                  </td>
                  <td>
                    <span className="expected-val">{item.expectedPercentage}%</span>
                  </td>
                  <td>
                    <div className="hypothesis-cell">
                      <span className="hypo-chip" title={`Rank ${rank} English letter`}>
                        {expectedLetter} ?
                      </span>
                      {item.count > 0 && !isAssigned && (
                        <button
                          type="button"
                          className="hypo-apply-btn"
                          onClick={() => onApplyHypothesis(item.letter, expectedLetter)}
                          title={`Assign hypothesis: ${item.letter} → ${expectedLetter}`}
                        >
                          Map to {expectedLetter}
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {isAssigned ? (
                      <span className="mapping-assigned-pill">
                        {item.letter} → <strong>{currentPlain}</strong>
                      </span>
                    ) : (
                      <span className="mapping-unassigned-pill">Unmapped</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
