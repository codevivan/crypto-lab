import { useState, useMemo } from "react";
import { encrypt as encryptCaesar } from "../crypto/caesar.js";
import {
  encrypt as encryptAffine,
  isValidAffineKey,
  VALID_A_KEYS,
} from "../crypto/affine.js";
import {
  encrypt as encryptProduct,
  getIntermediate as getProductIntermediate,
} from "../crypto/product.js";
import {
  encrypt as encryptSubstitution,
  generateRandomKey,
  validateKey,
  STANDARD_ALPHABET,
} from "../crypto/substitution.js";
import CipherModeSelector from "../components/CipherModeSelector.jsx";
import KeyMapping from "../components/KeyMapping.jsx";
import CipherInfo from "../components/CipherInfo.jsx";

const SAMPLE_TEXT_STANDARD = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";
const SAMPLE_TEXT_SUBSTITUTION =
  "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG. THIS IS A SAMPLE MESSAGE FOR CRYPTOGRAPHY LAB.";
const DEFAULT_SUBSTITUTION_KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";

export default function CipherSimulator() {
  const [mode, setMode] = useState("caesar");
  const [plaintext, setPlaintext] = useState(SAMPLE_TEXT_STANDARD);

  // Cipher parameters with sensible defaults
  const [caesarShift, setCaesarShift] = useState(3);
  const [affineA, setAffineA] = useState(5);
  const [affineB, setAffineB] = useState(8);
  const [productShift, setProductShift] = useState(3);
  const [productA, setProductA] = useState(5);
  const [productB, setProductB] = useState(8);
  const [substitutionKey, setSubstitutionKey] = useState(DEFAULT_SUBSTITUTION_KEY);

  const [copied, setCopied] = useState(false);

  // Validate substitution key when in substitution mode
  const keyValidation = useMemo(() => {
    return validateKey(substitutionKey);
  }, [substitutionKey]);

  // Compute intermediate text for product pipeline
  const productIntermediate = useMemo(() => {
    return getProductIntermediate(plaintext, productShift);
  }, [plaintext, productShift]);

  // Compute ciphertext live based on active mode
  const ciphertext = useMemo(() => {
    if (!plaintext) return "";
    try {
      if (mode === "caesar") {
        return encryptCaesar(plaintext, caesarShift);
      } else if (mode === "affine") {
        if (!isValidAffineKey(affineA, affineB)) return "";
        return encryptAffine(plaintext, affineA, affineB);
      } else if (mode === "product") {
        if (!isValidAffineKey(productA, productB)) return "";
        return encryptProduct(plaintext, productShift, productA, productB);
      } else if (mode === "substitution") {
        if (!keyValidation.isValid) return "";
        return encryptSubstitution(plaintext, substitutionKey);
      }
      return "";
    } catch {
      return "";
    }
  }, [
    mode,
    plaintext,
    caesarShift,
    affineA,
    affineB,
    productShift,
    productA,
    productB,
    substitutionKey,
    keyValidation.isValid,
  ]);

  // Copy ciphertext to clipboard
  const handleCopyCiphertext = async () => {
    if (!ciphertext) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(ciphertext);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = ciphertext;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // Reset controls to defaults for current mode
  const handleReset = () => {
    setPlaintext("");
    if (mode === "caesar") {
      setCaesarShift(3);
    } else if (mode === "affine") {
      setAffineA(5);
      setAffineB(8);
    } else if (mode === "product") {
      setProductShift(3);
      setProductA(5);
      setProductB(8);
    } else if (mode === "substitution") {
      setSubstitutionKey(DEFAULT_SUBSTITUTION_KEY);
    }
  };

  // Load sample text dynamically based on selected cipher mode
  const handleLoadSample = () => {
    if (mode === "substitution") {
      setPlaintext(SAMPLE_TEXT_SUBSTITUTION);
      // If current substitution key is invalid, generate a random valid key
      if (!validateKey(substitutionKey).isValid) {
        const newKey = generateRandomKey();
        setSubstitutionKey(newKey);
      }
    } else {
      setPlaintext(SAMPLE_TEXT_STANDARD);
    }
  };

  // Shift navigation helpers for Caesar
  const handleCaesarShiftChange = (val) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setCaesarShift(Math.max(0, Math.min(25, parsed)));
    }
  };

  const handleCaesarDecrement = () => {
    setCaesarShift((prev) => (prev > 0 ? prev - 1 : 25));
  };

  const handleCaesarIncrement = () => {
    setCaesarShift((prev) => (prev < 25 ? prev + 1 : 0));
  };

  // Handlers for Affine Addition Key
  const handleAffineBChange = (val) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setAffineB(Math.max(0, Math.min(25, parsed)));
    }
  };

  // Handlers for Product Cipher Layer Controls
  const handleProductShiftChange = (val) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setProductShift(Math.max(0, Math.min(25, parsed)));
    }
  };

  const handleProductBChange = (val) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setProductB(Math.max(0, Math.min(25, parsed)));
    }
  };

  // Letter count statistics
  const letterCount = useMemo(() => {
    const lettersOnly = (plaintext || "").replace(/[^A-Za-z]/g, "");
    return lettersOnly.length;
  }, [plaintext]);

  // Current algorithm badge text
  const algorithmSummary = useMemo(() => {
    if (mode === "caesar") return `Caesar (Shift ${caesarShift})`;
    if (mode === "affine") return `Affine (a=${affineA}, b=${affineB})`;
    if (mode === "product") return `Product (Caesar K=${productShift} + Affine a=${productA}, b=${productB})`;
    return "Substitution (26!)";
  }, [mode, caesarShift, affineA, affineB, productShift, productA, productB]);

  return (
    <div className="cipher-simulator">
      {/* HEADER SECTION */}
      <section className="simulator-header">
        <div className="simulator-header-text">
          <div className="section-label">INTERACTIVE LAB EXPERIMENT</div>
          <h2>Cipher Simulator</h2>
          <p>
            Encrypt plaintext and inspect transformations for classical ciphers.
            Explore mathematical modular operations, linear substitutions, sequential pipelines, and arbitrary alphabet permutations.
          </p>
        </div>

        {/* MODE SELECTOR */}
        <CipherModeSelector activeMode={mode} onSelectMode={setMode} />
      </section>

      {/* DUAL WORKSPACE PANELS */}
      <div className="simulator-workspace">
        {/* LEFT PANEL: PLAINTEXT & CIPHER CONFIG */}
        <div className="simulator-card panel-left">
          <div className="card-header">
            <div className="panel-title">
              <span className="panel-badge">INPUT</span>
              <h3>Plaintext Message</h3>
            </div>
            <span className="stat-pill">
              {plaintext.length} characters ({letterCount} letters)
            </span>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="plaintext-input"
              className="lab-textarea"
              rows={4}
              placeholder="Enter plaintext message to encrypt..."
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
            />
          </div>

          {/* DYNAMIC CIPHER CONTROLS */}
          <div className="cipher-controls">
            {/* 1. CAESAR CIPHER CONTROLS */}
            {mode === "caesar" && (
              <div className="caesar-controls-box">
                <div className="control-row-header">
                  <label htmlFor="caesar-shift-slider">
                    <strong>Caesar Shift Key (K)</strong>
                    <span>Range: 0 to 25 modulo 26</span>
                  </label>
                  <div className="shift-display">
                    <span className="shift-badge">K = {caesarShift}</span>
                  </div>
                </div>

                <div className="slider-control-group">
                  <button
                    type="button"
                    className="step-btn"
                    onClick={handleCaesarDecrement}
                    title="Decrease shift by 1"
                    aria-label="Decrease shift"
                  >
                    -
                  </button>
                  <input
                    id="caesar-shift-slider"
                    type="range"
                    min="0"
                    max="25"
                    value={caesarShift}
                    onChange={(e) => handleCaesarShiftChange(e.target.value)}
                    className="lab-slider"
                  />
                  <button
                    type="button"
                    className="step-btn"
                    onClick={handleCaesarIncrement}
                    title="Increase shift by 1"
                    aria-label="Increase shift"
                  >
                    +
                  </button>
                </div>

                <div className="slider-ticks">
                  <span>0 (A→A)</span>
                  <span>3 (A→D)</span>
                  <span>13 (ROT13)</span>
                  <span>25 (A→Z)</span>
                </div>

                <div className="control-formula-bar">
                  <span className="formula-tag">Formula</span>
                  <code>C = (P + {caesarShift}) mod 26</code>
                </div>
              </div>
            )}

            {/* 2. AFFINE CIPHER CONTROLS */}
            {mode === "affine" && (
              <div className="affine-controls-box">
                <div className="affine-formula-banner">
                  <div className="banner-left">
                    <span className="formula-label">AFFINE FORMULA</span>
                    <code>E(x) = ({affineA}x + {affineB}) mod 26</code>
                  </div>
                  <div className="banner-params">
                    <span className="param-pill">a = {affineA}</span>
                    <span className="param-pill">b = {affineB}</span>
                  </div>
                </div>

                {/* Key a: Multiplicative Key */}
                <div className="control-field-group">
                  <div className="control-row-header">
                    <label htmlFor="affine-a-select">
                      <strong>Multiplication Key (a)</strong>
                      <span>Must be relatively prime to 26: gcd(a, 26) = 1</span>
                    </label>
                    <span className="key-rule-badge">12 Valid Keys</span>
                  </div>

                  <div className="select-with-info">
                    <select
                      id="affine-a-select"
                      className="lab-native-select"
                      value={affineA}
                      onChange={(e) => setAffineA(parseInt(e.target.value, 10))}
                    >
                      {VALID_A_KEYS.map((k) => (
                        <option key={k} value={k}>
                          a = {k} {k === 1 ? "(Identity slope)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="valid-keys-hint">
                    <span className="hint-label">Valid values for a:</span>
                    <span className="hint-values">
                      {VALID_A_KEYS.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Key b: Additive Key */}
                <div className="control-field-group">
                  <div className="control-row-header">
                    <label htmlFor="affine-b-slider">
                      <strong>Addition Key (b)</strong>
                      <span>Shift offset from 0 to 25</span>
                    </label>
                    <span className="shift-badge">b = {affineB}</span>
                  </div>

                  <div className="slider-control-group">
                    <button
                      type="button"
                      className="step-btn"
                      onClick={() => setAffineB((prev) => (prev > 0 ? prev - 1 : 25))}
                      title="Decrease addition key"
                      aria-label="Decrease addition key"
                    >
                      -
                    </button>
                    <input
                      id="affine-b-slider"
                      type="range"
                      min="0"
                      max="25"
                      value={affineB}
                      onChange={(e) => handleAffineBChange(e.target.value)}
                      className="lab-slider"
                    />
                    <button
                      type="button"
                      className="step-btn"
                      onClick={() => setAffineB((prev) => (prev < 25 ? prev + 1 : 0))}
                      title="Increase addition key"
                      aria-label="Increase addition key"
                    >
                      +
                    </button>
                  </div>

                  <div className="slider-ticks">
                    <span>0 (No shift)</span>
                    <span>8 (Selected)</span>
                    <span>13</span>
                    <span>25 (Max)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PRODUCT CIPHER CONTROLS */}
            {mode === "product" && (
              <div className="product-controls-box">
                {/* Step 1: Caesar Layer */}
                <div className="product-step-card">
                  <div className="step-header">
                    <span className="step-badge">STEP 1</span>
                    <h4>Caesar Layer (Shift)</h4>
                    <span className="step-summary-tag">Shift = {productShift}</span>
                  </div>

                  <div className="slider-control-group">
                    <button
                      type="button"
                      className="step-btn"
                      onClick={() => setProductShift((prev) => (prev > 0 ? prev - 1 : 25))}
                      title="Decrease Caesar shift"
                      aria-label="Decrease Caesar shift"
                    >
                      -
                    </button>
                    <input
                      id="product-shift-slider"
                      type="range"
                      min="0"
                      max="25"
                      value={productShift}
                      onChange={(e) => handleProductShiftChange(e.target.value)}
                      className="lab-slider"
                    />
                    <button
                      type="button"
                      className="step-btn"
                      onClick={() => setProductShift((prev) => (prev < 25 ? prev + 1 : 0))}
                      title="Increase Caesar shift"
                      aria-label="Increase Caesar shift"
                    >
                      +
                    </button>
                  </div>
                  <div className="step-formula">
                    <code>Intermediate = (P + {productShift}) mod 26</code>
                  </div>
                </div>

                {/* Step 2: Affine Layer */}
                <div className="product-step-card">
                  <div className="step-header">
                    <span className="step-badge">STEP 2</span>
                    <h4>Affine Layer (Linear Transform)</h4>
                    <span className="step-summary-tag">a = {productA}, b = {productB}</span>
                  </div>

                  <div className="product-affine-grid">
                    <div className="param-subfield">
                      <label htmlFor="product-a-select">
                        <strong>Multiplication Key (a)</strong>
                      </label>
                      <select
                        id="product-a-select"
                        className="lab-native-select"
                        value={productA}
                        onChange={(e) => setProductA(parseInt(e.target.value, 10))}
                      >
                        {VALID_A_KEYS.map((k) => (
                          <option key={k} value={k}>
                            a = {k}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="param-subfield">
                      <div className="subfield-header">
                        <label htmlFor="product-b-slider">
                          <strong>Addition Key (b = {productB})</strong>
                        </label>
                      </div>
                      <div className="slider-control-group small-slider">
                        <button
                          type="button"
                          className="step-btn small-btn"
                          onClick={() => setProductB((prev) => (prev > 0 ? prev - 1 : 25))}
                          aria-label="Decrease b"
                        >
                          -
                        </button>
                        <input
                          id="product-b-slider"
                          type="range"
                          min="0"
                          max="25"
                          value={productB}
                          onChange={(e) => handleProductBChange(e.target.value)}
                          className="lab-slider"
                        />
                        <button
                          type="button"
                          className="step-btn small-btn"
                          onClick={() => setProductB((prev) => (prev < 25 ? prev + 1 : 0))}
                          aria-label="Increase b"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="step-formula">
                    <code>Ciphertext = ({productA} × Intermediate + {productB}) mod 26</code>
                  </div>
                </div>

                {/* Key Summary Box */}
                <div className="product-key-summary">
                  <div className="key-summary-header">
                    <strong>Product Cipher Key Summary</strong>
                    <span className="lab-def-badge">CryptoBreak Lab Implementation</span>
                  </div>
                  <div className="key-summary-pills">
                    <span>Caesar Shift: <strong>{productShift}</strong></span>
                    <span>Affine a: <strong>{productA}</strong></span>
                    <span>Affine b: <strong>{productB}</strong></span>
                  </div>
                  <p className="effective-process-line">
                    <strong>Effective process:</strong> <code>C = Affine(Caesar(P))</code>
                  </p>
                  <p className="composition-note">
                    CryptoBreak Lab Product Cipher: a sequential composition of Caesar and Affine transformations.
                  </p>
                </div>
              </div>
            )}

            {/* 4. MONOALPHABETIC SUBSTITUTION CONTROLS */}
            {mode === "substitution" && (
              <div className="substitution-controls-box">
                <div className="control-row-header">
                  <label htmlFor="substitution-key-input">
                    <strong>26-Letter Substitution Key (π)</strong>
                    <span>Must be a 26-letter permutation of A–Z</span>
                  </label>
                  <span className={`validation-pill ${keyValidation.isValid ? "valid" : "invalid"}`}>
                    {keyValidation.isValid ? "✓ Valid Permutation" : "⚠ Invalid Key"}
                  </span>
                </div>

                <div className="key-input-row">
                  <input
                    id="substitution-key-input"
                    type="text"
                    maxLength={26}
                    className={`lab-key-input ${!keyValidation.isValid ? "input-error" : ""}`}
                    value={substitutionKey}
                    onChange={(e) => setSubstitutionKey(e.target.value.toUpperCase())}
                    placeholder="Enter 26 distinct letters (A-Z)..."
                    aria-label="26-letter substitution key"
                  />
                  <button
                    type="button"
                    className="lab-btn secondary-btn"
                    onClick={() => setSubstitutionKey(generateRandomKey())}
                    title="Generate a completely randomized 26-letter permutation key"
                  >
                    🎲 Random Key
                  </button>
                  <button
                    type="button"
                    className="lab-btn secondary-btn"
                    onClick={() => setSubstitutionKey(STANDARD_ALPHABET)}
                    title="Reset key to standard alphabet (identity mapping)"
                  >
                    ↺ Identity
                  </button>
                </div>

                {!keyValidation.isValid && (
                  <div className="error-message">
                    <span>⚠️</span> {keyValidation.error}
                  </div>
                )}

                <div className="control-formula-bar">
                  <span className="formula-tag">Key Space</span>
                  <code>26! ≈ 4.0329 × 10²⁶ possible keys</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: CIPHERTEXT OUTPUT & PIPELINE */}
        <div className="simulator-card panel-right">
          <div className="card-header">
            <div className="panel-title">
              <span className="panel-badge cipher-badge">OUTPUT</span>
              <h3>Generated Ciphertext</h3>
            </div>
            <div className="header-actions">
              {copied && <span className="copied-pill">✓ Copied!</span>}
              <button
                type="button"
                className="lab-btn primary-btn small-btn"
                onClick={handleCopyCiphertext}
                disabled={!ciphertext}
              >
                📋 Copy
              </button>
            </div>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="ciphertext-output"
              className="lab-textarea cipher-output"
              rows={4}
              readOnly
              placeholder={
                mode === "substitution" && !keyValidation.isValid
                  ? "Awaiting a valid 26-letter substitution key..."
                  : "Ciphertext will appear here in real time..."
              }
              value={ciphertext}
            />
          </div>

          {/* PRODUCT CIPHER LIVE PIPELINE DISPLAY */}
          {mode === "product" && (
            <div className="pipeline-container">
              <div className="pipeline-header">
                <span className="pipeline-label">SEQUENTIAL PIPELINE TRACE</span>
                <span className="pipeline-status-tag">Live Dynamic Calculation</span>
              </div>

              <div className="pipeline-flow">
                {/* Node 1: Plaintext */}
                <div className="pipeline-node">
                  <div className="node-badge">PLAINTEXT</div>
                  <div className="node-content" title={plaintext}>
                    {plaintext ? plaintext.slice(0, 32) + (plaintext.length > 32 ? "…" : "") : "<em>(Empty)</em>"}
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="pipeline-arrow">
                  <span>↓</span>
                  <small>Caesar (+{productShift})</small>
                </div>

                {/* Node 2: Intermediate */}
                <div className="pipeline-node highlight-intermediate">
                  <div className="node-badge badge-intermediate">INTERMEDIATE TEXT</div>
                  <div className="node-content intermediate-text" title={productIntermediate}>
                    {productIntermediate
                      ? productIntermediate.slice(0, 32) + (productIntermediate.length > 32 ? "…" : "")
                      : "<em>(Empty)</em>"}
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="pipeline-arrow">
                  <span>↓</span>
                  <small>Affine ({productA}x + {productB})</small>
                </div>

                {/* Node 3: Ciphertext */}
                <div className="pipeline-node highlight-final">
                  <div className="node-badge badge-cipher">FINAL CIPHERTEXT</div>
                  <div className="node-content final-text" title={ciphertext}>
                    {ciphertext ? ciphertext.slice(0, 32) + (ciphertext.length > 32 ? "…" : "") : "<em>(Empty)</em>"}
                  </div>
                </div>
              </div>

              {/* Inversion Explanation Box */}
              <div className="pipeline-inversion-box">
                <div className="inversion-title">
                  <span>🔄</span> Transformation Inversion Property
                </div>
                <div className="inversion-diagram">
                  <div><strong>Encryption:</strong> Plaintext → Caesar → Affine → Ciphertext</div>
                  <div><strong>Decryption:</strong> Ciphertext → Affine → Caesar → Plaintext</div>
                </div>
                <p className="inversion-desc">
                  Because the product cipher is a composition of transformations, decryption applies the inverse transformations in reverse order.
                </p>
              </div>
            </div>
          )}

          {/* CIPHERTEXT QUICK METRICS */}
          <div className="ciphertext-meta">
            <div className="meta-card">
              <span>Status</span>
              <strong>
                {mode === "substitution" && !keyValidation.isValid
                  ? "Key Error"
                  : ciphertext.length > 0
                  ? "Encrypted"
                  : "Idle"}
              </strong>
            </div>
            <div className="meta-card">
              <span>Algorithm</span>
              <strong>{algorithmSummary}</strong>
            </div>
            <div className="meta-card">
              <span>Length</span>
              <strong>{ciphertext.length} chars</strong>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE ALPHABET TRANSFORMATION TABLE */}
      <KeyMapping
        mode={mode}
        caesarShift={mode === "product" ? productShift : caesarShift}
        affineA={mode === "product" ? productA : affineA}
        affineB={mode === "product" ? productB : affineB}
        substitutionKey={substitutionKey}
        isValidKey={keyValidation.isValid}
      />

      {/* WORKSPACE ACTION BAR */}
      <div className="simulator-actions-bar">
        <div className="action-buttons-left">
          <button
            type="button"
            className="lab-btn secondary-btn"
            onClick={handleLoadSample}
            id="load-sample-btn"
          >
            📄 Load Sample Text
          </button>
          <button
            type="button"
            className="lab-btn secondary-btn"
            onClick={handleReset}
            id="clear-reset-btn"
          >
            🧹 Clear / Reset
          </button>
        </div>

        <div className="action-buttons-right">
          <button
            type="button"
            className="lab-btn primary-btn"
            onClick={handleCopyCiphertext}
            disabled={!ciphertext}
            id="copy-ciphertext-btn"
          >
            {copied ? "✓ Copied!" : "📋 Copy Ciphertext"}
          </button>
        </div>
      </div>

      {/* VIVA & EDUCATIONAL HOW IT WORKS SECTION */}
      <CipherInfo mode={mode} />
    </div>
  );
}
