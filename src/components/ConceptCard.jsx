import { useState } from "react";

/**
 * ConceptCard Component
 * Displays rich pedagogical details for the active concept, including
 * interactive visual diagrams, definitions, examples, Viva Q&A, and an
 * optional 5-question interactive quiz for Affine and Product Cipher concepts.
 */
export default function ConceptCard({ concept, isViewed, onToggleViewed }) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState({});

  if (!concept) return null;

  const handleSelectAnswer = (qId, optionIdx) => {
    if (quizSubmitted[qId]) return; // locked after submission
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitAnswer = (qId) => {
    if (quizAnswers[qId] === undefined) return;
    setQuizSubmitted((prev) => ({ ...prev, [qId]: true }));
  };

  const hasQuiz = concept.quiz && concept.quiz.length > 0;
  const quizScore = hasQuiz
    ? concept.quiz.filter(
        (q) => quizSubmitted[q.id] && quizAnswers[q.id] === q.answer
      ).length
    : 0;
  const quizTotal = hasQuiz ? concept.quiz.length : 0;
  const allSubmitted =
    hasQuiz && concept.quiz.every((q) => quizSubmitted[q.id]);

  return (
    <div className="concept-display-card">
      {/* CARD HEADER */}
      <div className="concept-card-topbar">
        <div>
          <span className="concept-id-tag">CONCEPT {concept.number} • {concept.tag}</span>
          <h3 className="concept-main-title">{concept.title}</h3>
        </div>
        <button
          type="button"
          className={`mark-viewed-btn ${isViewed ? "viewed" : ""}`}
          onClick={onToggleViewed}
          title={isViewed ? "Mark as unviewed" : "Mark as viewed in progress tracker"}
        >
          {isViewed ? "✓ Viewed" : "Mark as Viewed"}
        </button>
      </div>

      {/* DEFINITION & WHY IT MATTERS */}
      <div className="concept-definition-box">
        <p className="concept-lead-text">{concept.definition}</p>
        <div className="concept-why-box">
          <strong>Why it matters:</strong> {concept.whyItMatters}
        </div>
      </div>

      {/* KEY IDEA */}
      <div className="key-idea-strip">
        <span className="key-idea-icon">💡</span>
        <div>
          <strong>Key Principle:</strong> {concept.keyIdea}
        </div>
      </div>

      {/* DEDICATED VISUAL DIAGRAM */}
      <div className="concept-visual-container">
        <span className="visual-header-tag">CONCEPTUAL DIAGRAM &amp; FLOW</span>

        {concept.visualType === "crypto-flow" && (
          <div className="flow-diagram">
            <div className="flow-step">
              <span>PLAINTEXT</span>
              <strong>HELLO WORLD</strong>
            </div>
            <div className="flow-arrow">➔ <code>Encrypt(Key)</code> ➔</div>
            <div className="flow-step cipher-step">
              <span>CIPHERTEXT</span>
              <strong>KHOOR ZRUOG</strong>
            </div>
            <div className="flow-arrow">➔ <code>Decrypt(Key)</code> ➔</div>
            <div className="flow-step">
              <span>PLAINTEXT</span>
              <strong>HELLO WORLD</strong>
            </div>
          </div>
        )}

        {concept.visualType === "attack-flow" && (
          <div className="flow-diagram">
            <div className="flow-step cipher-step">
              <span>INTERCEPTED CIPHERTEXT</span>
              <strong>KHOOR ZRUOG</strong>
            </div>
            <div className="flow-arrow">➔ <code>Cryptanalysis</code> ➔</div>
            <div className="flow-step attack-step">
              <span>ATTACK VECTOR</span>
              <strong>Brute Force / Frequency</strong>
            </div>
            <div className="flow-arrow">➔ <code>Deduction</code> ➔</div>
            <div className="flow-step">
              <span>RECOVERED PLAINTEXT</span>
              <strong>HELLO WORLD</strong>
            </div>
          </div>
        )}

        {concept.visualType === "mapping-table" && (
          <div className="mapping-visual-block">
            <div className="mapping-pairs-row">
              {["H", "E", "L", "L", "O"].map((p, idx) => {
                const c = ["I", "T", "S", "S", "G"][idx];
                return (
                  <div key={idx} className="map-pair-col">
                    <span className="pair-plain">{p}</span>
                    <span className="pair-arrow">↓</span>
                    <span className="pair-cipher">{c}</span>
                  </div>
                );
              })}
            </div>
            <p className="visual-caption">
              Notice: Double letter &lsquo;LL&rsquo; in plaintext directly maps to &lsquo;SS&rsquo; in ciphertext. Letter frequencies and repetitions are preserved.
            </p>
          </div>
        )}

        {concept.visualType === "shift-formula" && (
          <div className="formula-visual-block">
            <div className="formula-cards-row">
              <div className="formula-card">
                <span>ENCRYPTION FORMULA</span>
                <code>C = (P + K) mod 26</code>
              </div>
              <div className="formula-card">
                <span>DECRYPTION FORMULA</span>
                <code>P = (C - K + 26) mod 26</code>
              </div>
            </div>
            <div className="caesar-shift-track">
              <span>A(+3)➔D</span>
              <span>B(+3)➔E</span>
              <span>C(+3)➔F</span>
              <span>...</span>
              <span>X(+3)➔A</span>
              <span>Y(+3)➔B</span>
              <span>Z(+3)➔C</span>
            </div>
          </div>
        )}

        {concept.visualType === "brute-keys" && (
          <div className="brute-visual-block">
            <div className="brute-ladder">
              <div className="ladder-step"><span>Key 0:</span> <code>KHOOR ZRUOG</code> (K=0)</div>
              <div className="ladder-step"><span>Key 1:</span> <code>JGNNQ YQTNF</code> (K=1)</div>
              <div className="ladder-step"><span>Key 2:</span> <code>IFMMP XPSME</code> (K=2)</div>
              <div className="ladder-step ladder-match">
                <span>Key 3:</span> <code>HELLO WORLD</code> ✓ <strong>Match Found</strong>
              </div>
              <div className="ladder-step"><span>...Key 25:</span> <code>LIPPS ASVPH</code> (K=25)</div>
            </div>
          </div>
        )}

        {concept.visualType === "freq-bars" && (
          <div className="freq-visual-block">
            <div className="mini-bars-row">
              {[
                { l: "E", p: 12.7 },
                { l: "T", p: 9.1 },
                { l: "A", p: 8.2 },
                { l: "O", p: 7.5 },
                { l: "I", p: 7.0 },
                { l: "N", p: 6.7 },
                { l: "S", p: 6.3 },
              ].map((item) => (
                <div key={item.l} className="mini-bar-col">
                  <span className="mini-bar-percent">{item.p}%</span>
                  <div className="mini-bar-track" style={{ height: `${item.p * 6}px` }}></div>
                  <strong className="mini-bar-letter">{item.l}</strong>
                </div>
              ))}
            </div>
            <p className="visual-caption">
              ETAOIN SHRDLU: Natural English letter frequency distribution exploited by cryptanalysts.
            </p>
          </div>
        )}

        {concept.visualType === "ngram-boxes" && (
          <div className="ngram-visual-block">
            <div className="ngram-group">
              <span className="ngram-group-title">COMMON BIGRAMS (N = 2)</span>
              <div className="ngram-pills">
                {["TH", "HE", "IN", "ER", "AN", "RE", "ED", "ON"].map((bg) => (
                  <span key={bg} className="learn-ngram-chip">{bg}</span>
                ))}
              </div>
            </div>
            <div className="ngram-group">
              <span className="ngram-group-title">COMMON TRIGRAMS (N = 3)</span>
              <div className="ngram-pills">
                {["THE", "AND", "THA", "ENT", "ION", "TIO", "FOR"].map((tg) => (
                  <span key={tg} className="learn-ngram-chip trigram-chip">{tg}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {concept.visualType === "keyspace-comparison" && (
          <div className="keyspace-visual-block">
            <div className="comp-grid-learn">
              <div className="comp-tile">
                <span className="tile-title">CAESAR CIPHER</span>
                <strong>26 Keys</strong>
                <p>Brute force time: &lt; 0.001 ms</p>
                <div className="tile-status status-vulnerable">Vulnerable to Brute Force</div>
              </div>
              <div className="comp-tile">
                <span className="tile-title">MONOALPHABETIC SUBSTITUTION</span>
                <strong>26! ≈ 4.03 × 10²⁶ Keys</strong>
                <p>Brute force time: &gt; 12.7 billion years</p>
                <div className="tile-status status-invulnerable">Resistant to Brute Force (Vulnerable to Frequency)</div>
              </div>
            </div>
          </div>
        )}

        {concept.visualType === "lab-workflow" && (
          <div className="workflow-visual-block">
            <div className="workflow-step-box">
              <span className="wf-num">1</span>
              <div>
                <strong>Cipher Simulator</strong>
                <small>Plaintext ➔ Encryption ➔ Ciphertext</small>
              </div>
            </div>
            <div className="wf-arrow">➔</div>
            <div className="workflow-step-box">
              <span className="wf-num">2</span>
              <div>
                <strong>Attack Modules</strong>
                <small>Brute Force (Caesar) or Frequency (Substitution)</small>
              </div>
            </div>
            <div className="wf-arrow">➔</div>
            <div className="workflow-step-box">
              <span className="wf-num">3</span>
              <div>
                <strong>Practice Lab</strong>
                <small>5 Interactive Cryptanalysis Challenges</small>
              </div>
            </div>
          </div>
        )}

        {/* AFFINE CIPHER DIAGRAM */}
        {concept.visualType === "affine-formula" && (
          <div className="affine-concept-visual">
            <div className="affine-formula-cards">
              <div className="formula-card">
                <span>ENCRYPTION</span>
                <code>E(x) = (ax + b) mod 26</code>
              </div>
              <div className="formula-card">
                <span>DECRYPTION</span>
                <code>D(y) = a⁻¹(y − b) mod 26</code>
              </div>
              <div className="formula-card formula-card-req">
                <span>REQUIREMENT</span>
                <code>gcd(a, 26) = 1</code>
              </div>
            </div>

            <div className="affine-worked-example">
              <div className="affine-example-header">
                Worked Example — Encrypt &apos;H&apos; with a=5, b=8
              </div>
              <div className="affine-steps">
                <div className="affine-step">
                  <span className="step-num">1</span>
                  <span>H is index <strong>7</strong> (A=0, B=1, ...H=7)</span>
                </div>
                <div className="affine-step">
                  <span className="step-num">2</span>
                  <span>E(7) = (5 × 7 + 8) mod 26 = 43 mod 26 = <strong>17</strong></span>
                </div>
                <div className="affine-step">
                  <span className="step-num">3</span>
                  <span>Index 17 = letter <strong>R</strong></span>
                </div>
              </div>
            </div>

            <div className="affine-valid-keys">
              <span className="valid-keys-label">12 VALID VALUES FOR &lsquo;a&rsquo;:</span>
              <div className="valid-keys-chips">
                {[1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25].map((k) => (
                  <span key={k} className={`key-chip ${k === 5 ? "key-chip-active" : ""}`}>{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT CIPHER DIAGRAM */}
        {concept.visualType === "product-pipeline" && (
          <div className="product-concept-visual">
            <div className="product-pipeline-flow">
              <div className="pp-node pp-plaintext">
                <span className="pp-label">PLAINTEXT</span>
                <code className="pp-value">HELLO</code>
              </div>
              <div className="pp-arrow-block">
                <span className="pp-arrow">↓</span>
                <span className="pp-layer-tag">Layer 1: Caesar (Shift = 3)</span>
              </div>
              <div className="pp-node pp-intermediate">
                <span className="pp-label">INTERMEDIATE</span>
                <code className="pp-value">KHOOR</code>
              </div>
              <div className="pp-arrow-block">
                <span className="pp-arrow">↓</span>
                <span className="pp-layer-tag">Layer 2: Affine (a=5, b=8)</span>
              </div>
              <div className="pp-node pp-ciphertext">
                <span className="pp-label">CIPHERTEXT</span>
                <code className="pp-value">GRAAP</code>
              </div>
            </div>

            <div className="product-inversion-box">
              <div className="inversion-row">
                <strong>Encryption:</strong>
                <span>Plaintext → Caesar → Affine → Ciphertext</span>
              </div>
              <div className="inversion-row">
                <strong>Decryption:</strong>
                <span>Ciphertext → Affine⁻¹ → Caesar⁻¹ → Plaintext</span>
              </div>
              <p className="inversion-rule">
                Inverse Composition Rule: (f∘g)⁻¹ = g⁻¹∘f⁻¹
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SIMPLE EXAMPLE */}
      <div className="concept-example-box">
        <span className="box-tag">CONCRETE EXAMPLE</span>
        <div className="example-content-grid">
          <div>
            <span className="ex-label">Plaintext</span>
            <code className="ex-val">{concept.example.plain}</code>
          </div>
          <div>
            <span className="ex-label">Key / Parameter</span>
            <code className="ex-val">{concept.example.key}</code>
          </div>
          <div>
            <span className="ex-label">Ciphertext</span>
            <code className="ex-val">{concept.example.cipher}</code>
          </div>
        </div>
        <p className="ex-action-text">{concept.example.action}</p>
      </div>

      {/* QUICK VIVA BOX */}
      <div className="viva-qa-card">
        <div className="viva-qa-header">
          <span>🎓</span> <strong>Quick Viva Q&amp;A: Question &amp; Model Answer</strong>
        </div>
        <div className="viva-q">
          <strong>Question:</strong> {concept.vivaQuestion}
        </div>
        <div className="viva-a">
          <strong>Answer:</strong> {concept.vivaAnswer}
        </div>
      </div>

      {/* VIVA TAKEAWAY */}
      <div className="viva-takeaway-footer">
        <span className="takeaway-tag">CORE VIVA TAKEAWAY</span>
        <p>&ldquo;{concept.vivaTakeaway}&rdquo;</p>
      </div>

      {/* INTERACTIVE QUIZ SECTION */}
      {hasQuiz && (
        <div className="concept-quiz-section">
          <div className="quiz-header">
            <span className="quiz-header-icon">📝</span>
            <div>
              <strong>Self-Assessment Quiz</strong>
              <span className="quiz-subtitle">5 Questions — Test your understanding of {concept.title}</span>
            </div>
            {allSubmitted && (
              <div className={`quiz-score-pill ${quizScore >= 4 ? "score-great" : quizScore >= 2 ? "score-ok" : "score-low"}`}>
                Score: {quizScore} / {quizTotal}
              </div>
            )}
          </div>

          <div className="quiz-questions-list">
            {concept.quiz.map((q, qIdx) => {
              const selected = quizAnswers[q.id];
              const submitted = quizSubmitted[q.id];
              const isCorrect = submitted && selected === q.answer;
              const isWrong = submitted && selected !== q.answer;

              return (
                <div
                  key={q.id}
                  className={`quiz-question-card ${submitted ? (isCorrect ? "q-correct" : "q-wrong") : ""}`}
                >
                  <div className="quiz-question-header">
                    <span className="quiz-q-num">Q{qIdx + 1}</span>
                    <p className="quiz-q-text">{q.question}</p>
                  </div>

                  <div className="quiz-options">
                    {q.options.map((opt, optIdx) => {
                      let optClass = "quiz-option";
                      if (submitted) {
                        if (optIdx === q.answer) optClass += " opt-correct";
                        else if (optIdx === selected && isWrong) optClass += " opt-wrong";
                      } else if (selected === optIdx) {
                        optClass += " opt-selected";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={optClass}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          disabled={submitted}
                          aria-label={`Option ${optIdx + 1}: ${opt}`}
                        >
                          <span className="opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                          <span className="opt-text">{opt}</span>
                          {submitted && optIdx === q.answer && <span className="opt-check">✓</span>}
                          {submitted && optIdx === selected && isWrong && <span className="opt-x">✗</span>}
                        </button>
                      );
                    })}
                  </div>

                  {!submitted && (
                    <button
                      type="button"
                      className="lab-btn primary-btn quiz-submit-btn"
                      onClick={() => handleSubmitAnswer(q.id)}
                      disabled={selected === undefined}
                    >
                      Submit Answer
                    </button>
                  )}

                  {submitted && (
                    <div className={`quiz-explanation ${isCorrect ? "explanation-correct" : "explanation-wrong"}`}>
                      <span>{isCorrect ? "✓ Correct!" : "✗ Incorrect."}</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allSubmitted && (
            <div className={`quiz-final-result ${quizScore === quizTotal ? "result-perfect" : quizScore >= 3 ? "result-good" : "result-review"}`}>
              {quizScore === quizTotal && <span>🏆 Perfect Score! Excellent understanding of {concept.title}.</span>}
              {quizScore >= 3 && quizScore < quizTotal && <span>👍 Good work! Review the incorrect answers above.</span>}
              {quizScore < 3 && <span>📖 Revisit the concept above before continuing.</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
