import { useState, useMemo } from "react";
import {
  countLetterFrequency,
  getSortedFrequencies,
  getSortedNGrams,
  COMMON_ENGLISH_BIGRAMS,
  COMMON_ENGLISH_TRIGRAMS,
  ENGLISH_LETTERS_BY_FREQUENCY,
} from "../crypto/analysis";
import { encrypt as encryptSubst } from "../crypto/substitution";
import FrequencyChart from "../components/FrequencyChart";
import FrequencyTable from "../components/FrequencyTable";
import LetterMappingPanel from "../components/LetterMappingPanel";

// Standard sample for genuine mathematical demonstration
const SAMPLE_PLAINTEXT =
  "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG. THIS IS A SAMPLE MESSAGE FOR FREQUENCY ANALYSIS.";
const SAMPLE_KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";
// Generated dynamically via pure substitution engine
const INITIAL_SAMPLE_CIPHERTEXT = encryptSubst(SAMPLE_PLAINTEXT, SAMPLE_KEY);

export default function FrequencyAnalysis() {
  const [ciphertext, setCiphertext] = useState(INITIAL_SAMPLE_CIPHERTEXT);
  const [mapping, setMapping] = useState({});
  const [copied, setCopied] = useState(false);

  // Analysis calculations
  const { totalLetters, uniqueLettersCount } = useMemo(() => {
    const { counts, totalLetters } = countLetterFrequency(ciphertext);
    const uniqueLettersCount = Object.values(counts).filter((c) => c > 0).length;
    return { totalLetters, uniqueLettersCount };
  }, [ciphertext]);

  const sortedFrequencies = useMemo(() => {
    return getSortedFrequencies(ciphertext);
  }, [ciphertext]);

  const topBigrams = useMemo(() => {
    return getSortedNGrams(ciphertext, 2, 6);
  }, [ciphertext]);

  const topTrigrams = useMemo(() => {
    return getSortedNGrams(ciphertext, 3, 6);
  }, [ciphertext]);

  // Decrypted candidate based on current analyst mapping
  const decryptedCandidate = useMemo(() => {
    if (!ciphertext) return "";

    let result = "";
    for (let i = 0; i < ciphertext.length; i++) {
      const char = ciphertext[i];
      const upper = char.toUpperCase();
      const code = upper.charCodeAt(0);

      if (code >= 65 && code <= 90) {
        const plain = mapping[upper];
        if (plain) {
          result += char === upper ? plain : plain.toLowerCase();
        } else {
          result += "•"; // Unknown letter placeholder
        }
      } else {
        result += char; // Preserve whitespace, punctuation, numbers
      }
    }
    return result;
  }, [ciphertext, mapping]);

  // Mapping handlers
  const handleUpdateMapping = (cipherLetter, plainLetter) => {
    setMapping((prev) => {
      const updated = { ...prev };
      if (!plainLetter) {
        delete updated[cipherLetter];
      } else {
        updated[cipherLetter] = plainLetter;
      }
      return updated;
    });
  };

  const handleApplyHypothesis = (cipherLetter, plainLetter) => {
    handleUpdateMapping(cipherLetter, plainLetter);
  };

  const handleResetMappings = () => {
    setMapping({});
  };

  const handleAutoApplyTopHypotheses = () => {
    const newMapping = { ...mapping };
    // Map top 6 most frequent ciphertext letters to ETAOIN
    sortedFrequencies.slice(0, 6).forEach((item, index) => {
      if (item.count > 0) {
        newMapping[item.letter] = ENGLISH_LETTERS_BY_FREQUENCY[index];
      }
    });
    setMapping(newMapping);
  };

  // Clipboard copy
  const handleCopyCandidate = async () => {
    if (!decryptedCandidate) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(decryptedCandidate);
      } else {
        const temp = document.createElement("textarea");
        temp.value = decryptedCandidate;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleLoadSample = () => {
    setCiphertext(INITIAL_SAMPLE_CIPHERTEXT);
    setMapping({});
  };

  const handleClear = () => {
    setCiphertext("");
    setMapping({});
  };

  // Summary statistics
  const mostFrequentItem = sortedFrequencies[0] || { letter: "-", percentage: 0 };
  const mappedCount = Object.keys(mapping).filter((k) => mapping[k]).length;

  return (
    <div className="frequency-analysis-module">
      {/* HEADER SECTION */}
      <section className="module-intro">
        <div className="section-label">STATISTICAL CRYPTANALYSIS</div>
        <h2>Frequency Analysis</h2>
        <p>
          Analyze letter-frequency patterns to recover a monoalphabetic substitution.
          Because monoalphabetic ciphers preserve language letter distributions, observed frequencies form strong hypotheses for decryption.
        </p>
      </section>

      {/* WORKSPACE INPUT & CONTROLS */}
      <div className="freq-workspace-card simulator-card">
        <div className="card-header">
          <div className="panel-title">
            <span className="panel-badge">INPUT</span>
            <h3>Ciphertext to Analyze</h3>
          </div>
          <span className="stat-pill">
            {ciphertext.length} characters ({totalLetters} letters)
          </span>
        </div>

        <div className="textarea-wrapper">
          <textarea
            id="freq-ciphertext-input"
            className="lab-textarea cipher-output"
            rows={4}
            placeholder="Enter or paste ciphertext for frequency analysis..."
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value.toUpperCase())}
          />
        </div>

        <div className="input-quick-actions">
          <button
            type="button"
            className="lab-btn secondary-btn small-btn"
            onClick={handleLoadSample}
          >
            📄 Load Substitution Sample
          </button>
          <button
            type="button"
            className="lab-btn secondary-btn small-btn"
            onClick={handleClear}
          >
            🧹 Clear
          </button>
        </div>
      </div>

      {/* ATTACK STATISTICS GRID */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔤</div>
          <div>
            <strong>{totalLetters}</strong>
            <span>Letters Analyzed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div>
            <strong>{uniqueLettersCount} / 26</strong>
            <span>Unique Letters Found</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <strong>{mostFrequentItem.letter} ({mostFrequentItem.percentage}%)</strong>
            <span>Most Frequent Letter</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✍️</div>
          <div>
            <strong>{mappedCount} / 26</strong>
            <span>Mappings Formed</span>
          </div>
        </div>
      </section>

      {/* FREQUENCY CHART */}
      <FrequencyChart sortedData={sortedFrequencies} />

      {/* DUAL COLUMN: FREQUENCY TABLE & N-GRAMS */}
      <div className="freq-dual-grid">
        <FrequencyTable
          sortedFrequencies={sortedFrequencies}
          mapping={mapping}
          onApplyHypothesis={handleApplyHypothesis}
        />

        {/* N-GRAM ANALYSIS CARD */}
        <div className="ngram-card simulator-card">
          <div className="card-header">
            <div className="panel-title">
              <span className="panel-badge cipher-badge">N-GRAMS</span>
              <h3>Bigram & Trigram Patterns</h3>
            </div>
          </div>

          <p className="ngram-description">
            Recurring letter pairs and triplets provide vital contextual clues that help distinguish between similar frequency ranks (e.g. identifying &ldquo;THE&rdquo; or &ldquo;TH&rdquo;).
          </p>

          <div className="ngram-sections">
            <div className="ngram-block">
              <h5>Observed Ciphertext Bigrams (Top 6)</h5>
              <div className="ngram-pills-list">
                {topBigrams.length === 0 ? (
                  <span className="no-ngram">No bigrams detected</span>
                ) : (
                  topBigrams.map((b) => (
                    <div key={b.ngram} className="ngram-pill">
                      <strong>{b.ngram}</strong>
                      <span>{b.count}× ({b.percentage}%)</span>
                    </div>
                  ))
                )}
              </div>
              <div className="ngram-reference-note">
                <strong>Standard English:</strong> {COMMON_ENGLISH_BIGRAMS.slice(0, 6).join(", ")}
              </div>
            </div>

            <div className="ngram-block">
              <h5>Observed Ciphertext Trigrams (Top 6)</h5>
              <div className="ngram-pills-list">
                {topTrigrams.length === 0 ? (
                  <span className="no-ngram">No trigrams detected</span>
                ) : (
                  topTrigrams.map((t) => (
                    <div key={t.ngram} className="ngram-pill">
                      <strong>{t.ngram}</strong>
                      <span>{t.count}× ({t.percentage}%)</span>
                    </div>
                  ))
                )}
              </div>
              <div className="ngram-reference-note">
                <strong>Standard English:</strong> {COMMON_ENGLISH_TRIGRAMS.slice(0, 6).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE LETTER MAPPING PANEL */}
      <LetterMappingPanel
        mapping={mapping}
        onUpdateMapping={handleUpdateMapping}
        onResetMappings={handleResetMappings}
        onAutoApplyTopHypotheses={handleAutoApplyTopHypotheses}
      />

      {/* LIVE DECRYPTED CANDIDATE PREVIEW */}
      <div className="decrypted-candidate-card">
        <div className="candidate-header">
          <div className="candidate-title">
            <span className="candidate-icon">🔓</span>
            <div>
              <h4>Current Decrypted Candidate</h4>
              <p>
                Transformed in real time using your letter mappings. Unassigned letters appear as &ldquo;•&rdquo;.
              </p>
            </div>
          </div>
          <div className="candidate-actions">
            {copied && <span className="copied-pill">✓ Copied!</span>}
            <button
              type="button"
              className="lab-btn secondary-btn small-btn"
              onClick={handleCopyCandidate}
              disabled={!decryptedCandidate}
            >
              📋 Copy Candidate
            </button>
          </div>
        </div>

        <div className="candidate-text-container">
          <code className="candidate-plaintext-live">
            {decryptedCandidate || "(Awaiting ciphertext to decrypt...)"}
          </code>
        </div>
      </div>

      {/* ANALYST HINT CARD */}
      <div className="analyst-hint-card">
        <div className="hint-header">
          <span>💡</span> <strong>Analyst Lab Hint: How to proceed</strong>
        </div>
        <p>
          1. Notice that <strong>&lsquo;ZIT&rsquo;</strong> appears twice in the sample ciphertext. In English, the most common three-letter word is <strong>&lsquo;THE&rsquo;</strong>.<br />
          2. Hypothesize: <code>Z → T</code>, <code>I → H</code>, <code>T → E</code>. Test this mapping in the panel above and check the candidate output.<br />
          3. Notice how <strong>&lsquo;ZIOL OL&rsquo;</strong> transforms into <strong>&lsquo;TH•S •S&rsquo;</strong>, strongly indicating <code>O → I</code> and <code>L → S</code> for &ldquo;THIS IS&rdquo;!
        </p>
      </div>

      {/* KEYSPACE COMPARISON SECTION */}
      <div className="comparison-cards-grid">
        <div className="comp-card caesar-comp">
          <div className="comp-badge">CAESAR CIPHER</div>
          <h4>Exhaustive Brute Force</h4>
          <div className="comp-stat">Key Space: 26</div>
          <p>
            Because there are only 26 shifts, a computer can test all possibilities in milliseconds. No language analysis is needed to find the key.
          </p>
        </div>

        <div className="comp-card subst-comp">
          <div className="comp-badge active-comp">MONOALPHABETIC SUBSTITUTION</div>
          <h4>Frequency Analysis + Context</h4>
          <div className="comp-stat">Key Space: 26! ≈ 4.03 × 10²⁶</div>
          <p>
            Exhaustive search is physically impossible (&gt; 12 billion years). Instead, frequency distributions and n-gram patterns guide the analyst to break the key.
          </p>
        </div>
      </div>

      {/* HOW IT WORKS EDUCATIONAL CARD */}
      <div className="cipher-info-card">
        <div className="cipher-info-badge">
          <span>📚</span> HOW FREQUENCY ANALYSIS WORKS (VIVA CHEATSHEET)
        </div>

        <div className="cipher-info-grid">
          <div className="cipher-info-item">
            <h5>1. Letter Frequency Preservation</h5>
            <p>
              In a monoalphabetic substitution, each letter replaces another letter 1-to-1. While letter names change, their frequencies of occurrence remain completely preserved.
            </p>
          </div>

          <div className="cipher-info-item">
            <h5>2. Forming Statistical Hypotheses</h5>
            <p>
              By comparing the highest ciphertext frequencies with the English standard (<em>E, T, A, O, I, N</em>), we generate educated initial hypotheses.
            </p>
          </div>

          <div className="cipher-info-item">
            <h5>3. Context &amp; Digraph Verification</h5>
            <p>
              Frequency alone cannot guarantee a match because text length and style introduce variance. Analysts look at bigrams (<em>TH, HE, IN</em>) and partial word structures to verify.
            </p>
          </div>

          <div className="cipher-info-item highlight">
            <h5>4. Key Limitation</h5>
            <p>
              Short ciphertexts may have statistical deviations (e.g., an author avoiding the letter &apos;E&apos;). A sufficient sample size is required for reliable cryptanalysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
