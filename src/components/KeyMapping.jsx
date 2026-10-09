import { STANDARD_ALPHABET } from "../crypto/substitution.js";
import { encrypt as encryptCaesar } from "../crypto/caesar.js";
import { encrypt as encryptAffine, isValidAffineKey } from "../crypto/affine.js";

/**
 * KeyMapping Component
 * Displays the visual letter-by-letter transformation table.
 *
 * - For Caesar: Shows Plain -> Cipher (Shift K).
 * - For Affine: Shows Plain -> Cipher (E(x) = (ax + b) mod 26) dynamically computed.
 * - For Product: Shows the full 2-stage classical pipeline:
 *     Plain -> Caesar Intermediate -> Affine Final Ciphertext.
 * - For Substitution: Shows Plain -> Permutation letter mapping.
 */
export default function KeyMapping({
  mode,
  caesarShift = 3,
  affineA = 5,
  affineB = 8,
  substitutionKey,
  isValidKey = true,
}) {
  const letters = STANDARD_ALPHABET.split("");
  const isAffineValid = isValidAffineKey(affineA, affineB, 26);

  let headerDescription;
  let badgeText;

  if (mode === "caesar") {
    headerDescription = `Each plaintext letter is shifted forward by ${caesarShift} position${
      caesarShift === 1 ? "" : "s"
    } modulo 26.`;
    badgeText = `Shift K = ${caesarShift}`;
  } else if (mode === "affine") {
    headerDescription = isAffineValid
      ? `Each plaintext letter index x is mapped to (a·x + b) mod 26 with a = ${affineA}, b = ${affineB}.`
      : "Invalid multiplication key 'a'. Must be coprime to 26.";
    badgeText = isAffineValid ? `a = ${affineA}, b = ${affineB}` : "Invalid Key";
  } else if (mode === "product") {
    headerDescription = isAffineValid
      ? `Two-layer sequential composition: Plaintext is shifted by Caesar (K = ${caesarShift}), then transformed by Affine (a = ${affineA}, b = ${affineB}).`
      : "Invalid Affine parameters in Product pipeline.";
    badgeText = `Caesar: +${caesarShift} | Affine: (${affineA}x + ${affineB})`;
  } else {
    headerDescription = isValidKey
      ? "Each plaintext letter is substituted by its corresponding letter in the 26-character permutation key."
      : "Invalid substitution key. Key must contain all 26 letters without duplicates.";
    badgeText = isValidKey ? "Active Substitution Map" : "Invalid Key";
  }

  const isErrorBadge =
    (!isAffineValid && (mode === "affine" || mode === "product")) ||
    (!isValidKey && mode === "substitution");

  return (
    <div className="key-mapping-card">
      <div className="key-mapping-header">
        <div>
          <h4>Visual Alphabet Transformation</h4>
          <p>{headerDescription}</p>
        </div>
        <span className={`mapping-badge ${isErrorBadge ? "badge-error" : ""}`}>
          {badgeText}
        </span>
      </div>

      <div className="mapping-table-wrapper">
        <div className={`mapping-table ${mode === "product" ? "product-mapping-table" : ""}`}>
          {letters.map((plainChar, index) => {
            let intermediateChar = "";
            let finalCipherChar = "?";

            if (mode === "caesar") {
              finalCipherChar = encryptCaesar(plainChar, caesarShift);
            } else if (mode === "affine") {
              if (isAffineValid) {
                try {
                  finalCipherChar = encryptAffine(plainChar, affineA, affineB);
                } catch {
                  finalCipherChar = "?";
                }
              }
            } else if (mode === "product") {
              intermediateChar = encryptCaesar(plainChar, caesarShift);
              if (isAffineValid) {
                try {
                  finalCipherChar = encryptAffine(intermediateChar, affineA, affineB);
                } catch {
                  finalCipherChar = "?";
                }
              }
            } else if (substitutionKey && substitutionKey[index] && isValidKey) {
              finalCipherChar = substitutionKey[index].toUpperCase();
            }

            const isShifted = plainChar !== finalCipherChar;

            if (mode === "product") {
              return (
                <div
                  key={plainChar}
                  className={`mapping-column product-column ${isShifted ? "shifted" : "identical"}`}
                  title={`Plain '${plainChar}' → Caesar '${intermediateChar}' → Affine '${finalCipherChar}'`}
                >
                  <div className="mapping-cell plain" title={`Plaintext letter '${plainChar}'`}>
                    {plainChar}
                  </div>
                  <div className="mapping-arrow product-arrow" title="Caesar Layer">
                    ↓
                  </div>
                  <div className="mapping-cell intermediate" title={`Intermediate Caesar '${intermediateChar}'`}>
                    {intermediateChar}
                  </div>
                  <div className="mapping-arrow product-arrow" title="Affine Layer">
                    ↓
                  </div>
                  <div className="mapping-cell cipher" title={`Final Ciphertext '${finalCipherChar}'`}>
                    {finalCipherChar}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={plainChar}
                className={`mapping-column ${isShifted ? "shifted" : "identical"}`}
              >
                <div className="mapping-cell plain" title={`Plaintext letter '${plainChar}'`}>
                  {plainChar}
                </div>
                <div className="mapping-arrow">↓</div>
                <div className="mapping-cell cipher" title={`Ciphertext substitution '${finalCipherChar}'`}>
                  {finalCipherChar}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {mode === "product" && (
        <div className="product-mapping-legend">
          <span className="legend-item"><span className="legend-swatch swatch-plain"></span> Plaintext (P)</span>
          <span className="legend-item"><span className="legend-swatch swatch-intermediate"></span> Layer 1: Caesar Intermediate</span>
          <span className="legend-item"><span className="legend-swatch swatch-cipher"></span> Layer 2: Final Affine Ciphertext (C)</span>
        </div>
      )}
    </div>
  );
}
