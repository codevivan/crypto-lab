import { STANDARD_ALPHABET } from "../crypto/substitution";

/**
 * LetterMappingPanel Component
 * Interactive workspace where the analyst assigns plaintext letters to ciphertext letters.
 * Highlights duplicate plaintext assignments to enforce bijective mapping.
 */
export default function LetterMappingPanel({
  mapping,
  onUpdateMapping,
  onResetMappings,
  onAutoApplyTopHypotheses,
}) {
  const letters = STANDARD_ALPHABET.split("");

  // Check for duplicate plaintext assignments
  const assignedValues = Object.values(mapping).filter(Boolean);
  const duplicates = new Set(
    assignedValues.filter((item, index) => assignedValues.indexOf(item) !== index)
  );

  const mappedCount = Object.keys(mapping).filter((k) => mapping[k]).length;

  return (
    <div className="letter-mapping-card">
      <div className="mapping-panel-header">
        <div>
          <h4>Interactive Analyst Letter Mapping</h4>
          <p>
            Assign candidate plaintext letters to ciphertext letters. Decrypted candidate text updates immediately.
          </p>
        </div>
        <div className="mapping-header-actions">
          <button
            type="button"
            className="lab-btn secondary-btn small-btn"
            onClick={onAutoApplyTopHypotheses}
            title="Automatically assign the top 6 frequency hypotheses (E, T, A, O, I, N)"
          >
            ⚡ Auto-Map Top (ETAOIN)
          </button>
          <button
            type="button"
            className="lab-btn secondary-btn small-btn"
            onClick={onResetMappings}
            disabled={mappedCount === 0}
          >
            ↺ Reset Mappings
          </button>
        </div>
      </div>

      {duplicates.size > 0 && (
        <div className="duplicate-warning-banner">
          <span>⚠️</span>
          <div>
            <strong>Duplicate Plaintext Assignments Detected:</strong>{" "}
            {Array.from(duplicates).join(", ")}. In a valid monoalphabetic substitution, each letter must map to a unique plaintext letter.
          </div>
        </div>
      )}

      <div className="mapping-grid-container">
        {letters.map((cipherChar) => {
          const currentPlain = mapping[cipherChar] || "";
          const isDuplicate = currentPlain && duplicates.has(currentPlain);

          return (
            <div
              key={cipherChar}
              className={`mapping-unit ${currentPlain ? "is-mapped" : ""} ${
                isDuplicate ? "is-duplicate" : ""
              }`}
            >
              <div className="cipher-unit-label" title={`Cipher letter '${cipherChar}'`}>
                {cipherChar}
              </div>
              <div className="mapping-arrow-small">↓</div>
              <select
                className={`plain-unit-select ${isDuplicate ? "select-error" : ""}`}
                value={currentPlain}
                onChange={(e) => onUpdateMapping(cipherChar, e.target.value)}
                aria-label={`Assign plaintext substitution for ciphertext letter ${cipherChar}`}
              >
                <option value="">?</option>
                {letters.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className="mapping-footer-stats">
        <span>Mapped: <strong>{mappedCount} / 26</strong> letters</span>
        <span>Remaining: <strong>{26 - mappedCount}</strong> letters unassigned</span>
      </div>
    </div>
  );
}
