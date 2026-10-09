/**
 * CipherModeSelector Component
 * Provides a clean, accessible dropdown selector for switching between:
 * 1. Caesar Cipher
 * 2. Affine Cipher
 * 3. Product Cipher
 * 4. Monoalphabetic Substitution Cipher
 */

const CIPHER_OPTIONS = [
  {
    id: "caesar",
    name: "Caesar Cipher",
    description: "Shifts each letter by a fixed amount.",
    badge: "Key Space: 26",
    formula: "C = (P + K) mod 26",
  },
  {
    id: "affine",
    name: "Affine Cipher",
    description: "Applies a linear transformation using multiplication and addition modulo 26.",
    badge: "Key Space: 312",
    formula: "E(x) = (ax + b) mod 26",
  },
  {
    id: "product",
    name: "Product Cipher",
    description: "Applies multiple cipher transformations sequentially to produce the final ciphertext.",
    badge: "Caesar + Affine",
    formula: "C = Affine(Caesar(P))",
  },
  {
    id: "substitution",
    name: "Monoalphabetic Substitution Cipher",
    description: "Substitutes each letter of the alphabet with a unique letter from a fixed 26-letter permutation key.",
    badge: "Key Space: 26! ≈ 4.03 × 10²⁶",
    formula: "π: A → A (Permutation Key)",
  },
];

export default function CipherModeSelector({ activeMode, onSelectMode }) {
  const currentCipher = CIPHER_OPTIONS.find((c) => c.id === activeMode) || CIPHER_OPTIONS[0];

  return (
    <div className="cipher-selector-box">
      <div className="cipher-selector-field">
        <label htmlFor="cipher-mode-select" className="cipher-selector-label">
          CIPHER TYPE
        </label>
        <div className="select-wrapper">
          <select
            id="cipher-mode-select"
            className="lab-cipher-select"
            value={activeMode}
            onChange={(e) => onSelectMode(e.target.value)}
            aria-label="Select Cipher Type"
          >
            <option value="caesar">Caesar Cipher</option>
            <option value="affine">Affine Cipher</option>
            <option value="product">Product Cipher</option>
            <option value="substitution">Monoalphabetic Substitution Cipher</option>
          </select>
          <span className="select-chevron" aria-hidden="true">
            ▼
          </span>
        </div>
      </div>

      <div className="cipher-mode-description-card">
        <div className="cipher-mode-desc-text">
          <p>{currentCipher.description}</p>
        </div>
        <div className="cipher-mode-desc-meta">
          <span className="cipher-mode-badge">{currentCipher.badge}</span>
          <code className="cipher-mode-formula">{currentCipher.formula}</code>
        </div>
      </div>
    </div>
  );
}
