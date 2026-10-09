/**
 * BruteForceInfo Component
 * Educational callout explaining why Caesar ciphers succumb to exhaustive search
 * while general monoalphabetic substitution ciphers do not.
 */
export default function BruteForceInfo() {
  return (
    <div className="cipher-info-card">
      <div className="cipher-info-badge">
        <span>💡</span> CRYPTANALYSIS THEORY & VIVA CHEATSHEET
      </div>

      <div className="cipher-info-grid">
        <div className="cipher-info-item">
          <h5>1. Kerckhoffs&apos;s Principle</h5>
          <p>
            In modern cryptanalysis, we assume the attacker completely understands the algorithm (Caesar substitution) and only lacks the secret key (shift value <em>K</em>).
          </p>
        </div>

        <div className="cipher-info-item">
          <h5>2. Exhaustive Search Method</h5>
          <p>
            Brute-force testing systematically enumerates all elements in the key space: <em>K ∈ [0, 25]</em>. Every candidate is decrypted: <code>P = (C - K + 26) mod 26</code>.
          </p>
        </div>

        <div className="cipher-info-item highlight">
          <h5>3. Why Caesar is Trivial to Break</h5>
          <div className="formula-box">
            <code>Key Space: |K| = 26</code>
            <code>Time to test all keys: &lt; 0.001 milliseconds</code>
          </div>
          <p style={{ marginTop: "8px" }}>
            Because the key space is so small, exhaustive search is 100% guaranteed to find the plaintext almost instantaneously.
          </p>
        </div>

        <div className="cipher-info-item comparison-highlight">
          <h5 style={{ color: "var(--danger-mid, #dc2626)" }}>4. Why Not Substitution (26!)?</h5>
          <div className="formula-box">
            <code>Key Space: 26! ≈ 4.0329 × 10²⁶ keys</code>
            <code>Exhaustive Brute Force: Physically Impossible</code>
          </div>
          <p style={{ marginTop: "8px" }}>
            Testing 1,000,000,000,000 (10¹²) keys per second would still take over <strong>12 billion years</strong>. That is why cryptanalysts must use <em>Frequency Analysis</em> instead of brute force for general substitution.
          </p>
        </div>
      </div>
    </div>
  );
}
