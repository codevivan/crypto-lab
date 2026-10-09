/**
 * CipherInfo Component
 * Educational callout explaining the cryptographic principles, mathematical formulas,
 * key spaces, and viva cheatsheet notes for Caesar, Affine, and Product ciphers.
 */
export default function CipherInfo({ mode }) {
  if (mode === "caesar") {
    return (
      <div className="cipher-info-card">
        <div className="cipher-info-badge">
          <span>💡</span> EDUCATIONAL CONCEPT &amp; VIVA CHEATSHEET
        </div>

        <div className="cipher-info-grid">
          <div className="cipher-info-item">
            <h5>Core Mechanism</h5>
            <p>
              The <strong>Caesar Cipher</strong> is a monoalphabetic shift cipher where each letter is shifted by a fixed key amount across the 26-letter alphabet.
            </p>
          </div>

          <div className="cipher-info-item">
            <h5>Mathematical Formula</h5>
            <div className="formula-box">
              <code>Encryption: C = (P + K) mod 26</code>
              <code>Decryption: P = (C - K + 26) mod 26</code>
            </div>
          </div>

          <div className="cipher-info-item">
            <h5>Key Space &amp; Brute Force</h5>
            <p>
              Key Space: <strong>26 keys</strong> (25 non-trivial shifts where K &gt; 0). An exhaustive brute-force attack testing all 25 keys completes in sub-millisecond time.
            </p>
          </div>

          <div className="cipher-info-item highlight">
            <h5>Viva Focus: Why is it weak?</h5>
            <p>
              1. <em>Trivial key space:</em> Only 26 shifts.<br />
              2. <em>Preserves letter frequencies:</em> The statistical distribution of the natural language is shifted uniformly, exposing the shift via frequency analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "affine") {
    return (
      <div className="cipher-info-card">
        <div className="cipher-info-badge">
          <span>💡</span> EDUCATIONAL CONCEPT &amp; VIVA CHEATSHEET
        </div>

        <div className="cipher-info-grid">
          <div className="cipher-info-item">
            <h5>Core Mechanism</h5>
            <p>
              The <strong>Affine Cipher</strong> is a monoalphabetic substitution that applies a linear mathematical transformation combining modular multiplication and modular addition.
            </p>
          </div>

          <div className="cipher-info-item">
            <h5>Mathematical Formulas</h5>
            <div className="formula-box">
              <code>Encryption: E(x) = (ax + b) mod 26</code>
              <code>Decryption: D(y) = a⁻¹(y - b) mod 26</code>
              <code>Coprimality Requirement: gcd(a, 26) = 1</code>
            </div>
          </div>

          <div className="cipher-info-item">
            <h5>Key Space: 12 × 26 = 312 Keys</h5>
            <p>
              • <strong>Multiplicative Key (a):</strong> Exactly 12 integers in 0–25 are coprime to 26: &#123;1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25&#125;.<br />
              • <strong>Additive Key (b):</strong> 26 possible shifts from 0 to 25.<br />
              Total valid keys = <strong>12 × 26 = 312 keys</strong>.
            </p>
          </div>

          <div className="cipher-info-item highlight">
            <h5>Viva Focus: Why must gcd(a, 26) = 1?</h5>
            <p>
              If <code>gcd(a, 26) ≠ 1</code>, multiple plaintext letters map to the same ciphertext letter (non-injective), meaning the modular multiplicative inverse <code>a⁻¹</code> does not exist and unique decryption is mathematically impossible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "product") {
    return (
      <div className="cipher-info-card">
        <div className="cipher-info-badge">
          <span>💡</span> EDUCATIONAL CONCEPT &amp; VIVA CHEATSHEET
        </div>

        <div className="cipher-info-grid">
          <div className="cipher-info-item">
            <h5>Core Mechanism</h5>
            <p>
              A <strong>Product Cipher</strong> combines multiple cryptographic transformations sequentially to enhance cryptographic strength through iterated rounds.
            </p>
          </div>

          <div className="cipher-info-item">
            <h5>CryptoBreak Lab Implementation</h5>
            <div className="formula-box">
              <code>Pipeline: Plaintext → Caesar → Intermediate → Affine → Ciphertext</code>
              <code>Effective Function: C = Affine(Caesar(P))</code>
            </div>
            <p className="cipher-info-note">
              <em>Note:</em> CryptoBreak Lab uses a sequential composition of Caesar and Affine transformations for this virtual lab demonstration. Product ciphers in modern cryptography (like SP-networks and Feistel ciphers) alternate substitution and permutation.
            </p>
          </div>

          <div className="cipher-info-item">
            <h5>Decryption Inversion Rule</h5>
            <div className="formula-box">
              <code>Decryption: Ciphertext → Affine⁻¹ → Caesar⁻¹ → Plaintext</code>
              <code>Effective Recovery: P = Caesar⁻¹(Affine⁻¹(C))</code>
            </div>
            <p>
              Because the product cipher is a composition of transformations, decryption applies the inverse transformations in <strong>reverse order</strong>.
            </p>
          </div>

          <div className="cipher-info-item highlight">
            <h5>Viva Focus: Classical Composition Property</h5>
            <p>
              In classical modular arithmetic, the composition of two linear functions is itself another linear function: <code>a·(P + K) + b = a·P + (a·K + b) mod 26</code>. While educational, classical product ciphers still remain vulnerable to frequency analysis without nonlinear S-boxes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for general substitution
  return (
    <div className="cipher-info-card">
      <div className="cipher-info-badge">
        <span>💡</span> EDUCATIONAL CONCEPT &amp; VIVA CHEATSHEET
      </div>

      <div className="cipher-info-grid">
        <div className="cipher-info-item">
          <h5>Core Mechanism</h5>
          <p>
            A <strong>General Monoalphabetic Substitution</strong> replaces each of the 26 letters with another letter chosen from an arbitrary permutation of the alphabet.
          </p>
        </div>

        <div className="cipher-info-item">
          <h5>Key Space</h5>
          <div className="formula-box">
            <code>Total Keys = 26! ≈ 4.0329 × 10²⁶</code>
            <code>Time to brute force @ 10¹² keys/sec &gt; 12 billion years</code>
          </div>
        </div>

        <div className="cipher-info-item">
          <h5>Why Brute Force Fails</h5>
          <p>
            Because the key space has <strong>403 septillion</strong> possibilities, exhaustive search is computationally impossible.
          </p>
        </div>

        <div className="cipher-info-item highlight">
          <h5>Viva Focus: Frequency Analysis Attack</h5>
          <p>
            Even though brute force is impossible, the cipher has <strong>frequency preservation</strong>. If &apos;E&apos; occurs 13% of the time in English, the letter substituting &apos;E&apos; will also appear ~13% of the time in the ciphertext.
          </p>
        </div>
      </div>
    </div>
  );
}
