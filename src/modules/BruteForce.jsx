import { useState, useEffect, useRef, useMemo } from "react";
import { decrypt } from "../crypto/caesar";
import BruteForceResults from "../components/BruteForceResults";
import BruteForceInfo from "../components/BruteForceInfo";

const SAMPLE_CIPHERTEXT = "KHOOR ZRUOG";

const SPEED_CONFIG = {
  slow: { label: "Slow", delay: 400 },
  normal: { label: "Normal", delay: 180 },
  fast: { label: "Fast", delay: 50 },
};

export default function BruteForce() {
  const [ciphertext, setCiphertext] = useState(SAMPLE_CIPHERTEXT);
  const [attackStatus, setAttackStatus] = useState("idle"); // "idle" | "running" | "paused" | "completed"
  const [currentShift, setCurrentShift] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [speed, setSpeed] = useState("normal");
  const [copied, setCopied] = useState(false);

  const timerRef = useRef(null);

  // Attack step execution effect
  useEffect(() => {
    if (attackStatus !== "running") return;

    const delay = SPEED_CONFIG[speed].delay;

    timerRef.current = setTimeout(() => {
      const candidate = decrypt(ciphertext, currentShift);

      setAttempts((prev) => {
        // Prevent duplicate entries for the same shift
        const filtered = prev.filter((a) => a.shift !== currentShift);
        return [
          ...filtered,
          {
            attemptNum: currentShift + 1,
            shift: currentShift,
            candidate,
            status: "Tested",
          },
        ];
      });

      // If we are attacking the sample and reach shift 3, highlight it
      if (
        ciphertext.trim().toUpperCase() === SAMPLE_CIPHERTEXT &&
        currentShift === 3 &&
        selectedShift === null
      ) {
        setSelectedShift(3);
      }

      if (currentShift < 25) {
        setCurrentShift((prev) => prev + 1);
      } else {
        setAttackStatus("completed");
        // Default select shift 3 if sample was run and nothing explicitly selected
        if (ciphertext.trim().toUpperCase() === SAMPLE_CIPHERTEXT && selectedShift === null) {
          setSelectedShift(3);
        }
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [attackStatus, currentShift, ciphertext, speed, selectedShift]);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Control handlers
  const handleStartAttack = () => {
    if (!ciphertext.trim()) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setAttempts([]);
    setCurrentShift(0);
    setSelectedShift(null);
    setAttackStatus("running");
  };

  const handlePauseAttack = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAttackStatus("paused");
  };

  const handleResumeAttack = () => {
    if (currentShift <= 25) {
      setAttackStatus("running");
    }
  };

  const handleResetAttack = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAttackStatus("idle");
    setCurrentShift(0);
    setAttempts([]);
    setSelectedShift(null);
  };

  const handleLoadSample = () => {
    handleResetAttack();
    setCiphertext(SAMPLE_CIPHERTEXT);
  };

  const handleClearCiphertext = () => {
    handleResetAttack();
    setCiphertext("");
  };

  // Copy candidate / recovered text
  const handleCopy = async (textToCopy) => {
    if (!textToCopy) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const temp = document.createElement("textarea");
        temp.value = textToCopy;
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

  // Currently live candidate during animation
  const liveCandidate = useMemo(() => {
    if (attempts.length === 0 && attackStatus === "idle") {
      return ciphertext;
    }
    const currentAttempt = attempts.find((a) => a.shift === currentShift);
    return currentAttempt ? currentAttempt.candidate : decrypt(ciphertext, currentShift);
  }, [attempts, attackStatus, ciphertext, currentShift]);

  // Selected candidate object
  const selectedAttempt = useMemo(() => {
    if (selectedShift === null) return null;
    return attempts.find((a) => a.shift === selectedShift) || {
      shift: selectedShift,
      candidate: decrypt(ciphertext, selectedShift),
    };
  }, [attempts, ciphertext, selectedShift]);

  // Calculations for stats
  const keysTestedCount = attempts.length;
  const progressPercent = Math.round((keysTestedCount / 26) * 100);

  return (
    <div className="brute-force-module">
      {/* HEADER SECTION */}
      <section className="module-intro">
        <div className="section-label">EXHAUSTIVE SEARCH SIMULATION</div>
        <h2>Brute Force Attack</h2>
        <p>
          Try every possible Caesar key and observe how exhaustive search can recover the plaintext.
          Because Caesar ciphers only have 26 possible shifts, every single key can be tested within milliseconds.
        </p>
      </section>

      {/* WORKSPACE GRID */}
      <div className="brute-workspace">
        {/* LEFT CARD: CIPHERTEXT INPUT */}
        <div className="simulator-card brute-input-card">
          <div className="card-header">
            <div className="panel-title">
              <span className="panel-badge">TARGET</span>
              <h3>Ciphertext to Attack</h3>
            </div>
            <span className="stat-pill">{ciphertext.length} characters</span>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="brute-ciphertext-input"
              className="lab-textarea cipher-output"
              rows={4}
              placeholder="Enter or paste ciphertext to break with brute force..."
              value={ciphertext}
              disabled={attackStatus === "running"}
              onChange={(e) => {
                setCiphertext(e.target.value.toUpperCase());
                if (attackStatus !== "idle") handleResetAttack();
              }}
            />
          </div>

          <div className="input-quick-actions">
            <button
              type="button"
              className="lab-btn secondary-btn small-btn"
              onClick={handleLoadSample}
              disabled={attackStatus === "running"}
            >
              📄 Load Sample (KHOOR ZRUOG)
            </button>
            <button
              type="button"
              className="lab-btn secondary-btn small-btn"
              onClick={handleClearCiphertext}
              disabled={attackStatus === "running"}
            >
              🧹 Clear
            </button>
          </div>
        </div>

        {/* RIGHT CARD: ATTACK CONFIGURATION */}
        <div className="simulator-card brute-config-card">
          <div className="card-header">
            <div className="panel-title">
              <span className="panel-badge cipher-badge">CONFIG</span>
              <h3>Attack Parameters</h3>
            </div>
            <span className="status-pill status-ready">
              {attackStatus === "running" ? (
                <>
                  <span className="pulse-dot"></span> Attacking
                </>
              ) : attackStatus === "paused" ? (
                "⏸ Paused"
              ) : attackStatus === "completed" ? (
                "✓ Finished"
              ) : (
                "Ready"
              )}
            </span>
          </div>

          <div className="config-grid">
            <div className="config-item">
              <span>Target Cipher</span>
              <strong>Caesar Cipher</strong>
            </div>
            <div className="config-item">
              <span>Key Space</span>
              <strong>26 possible shifts (K ∈ [0, 25])</strong>
            </div>
            <div className="config-item">
              <span>Attack Strategy</span>
              <strong>Sequential Exhaustive Search</strong>
            </div>
            <div className="config-item">
              <span>Simulation Speed</span>
              <div className="speed-buttons-group">
                {Object.keys(SPEED_CONFIG).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`speed-btn ${speed === s ? "active" : ""}`}
                    onClick={() => setSpeed(s)}
                    disabled={attackStatus === "running"}
                  >
                    {SPEED_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATTACK CONTROL BAR */}
      <div className="brute-control-bar">
        <div className="control-bar-left">
          {attackStatus === "running" ? (
            <button
              type="button"
              className="lab-btn secondary-btn"
              onClick={handlePauseAttack}
            >
              ⏸ Pause Attack
            </button>
          ) : attackStatus === "paused" ? (
            <button
              type="button"
              className="lab-btn primary-btn"
              onClick={handleResumeAttack}
            >
              ▶ Resume Attack
            </button>
          ) : (
            <button
              type="button"
              className="lab-btn primary-btn"
              onClick={handleStartAttack}
              disabled={!ciphertext.trim()}
            >
              🚀 {attackStatus === "completed" ? "Restart Attack" : "Start Brute-Force Attack"}
            </button>
          )}

          <button
            type="button"
            className="lab-btn secondary-btn"
            onClick={handleResetAttack}
            disabled={attackStatus === "idle" && attempts.length === 0}
          >
            ↺ Reset
          </button>
        </div>

        <div className="control-bar-right">
          <div className="progress-badge">
            Progress: <strong>{keysTestedCount} / 26</strong> ({progressPercent}%)
          </div>
        </div>
      </div>

      {/* LIVE PROGRESS CARD */}
      <div className="brute-live-card">
        <div className="progress-track-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="live-indicators-grid">
          <div className="indicator-box">
            <span className="indicator-label">CURRENT SHIFT TESTED</span>
            <div className="indicator-value">
              <span className="shift-display-pill">
                K = {attackStatus === "idle" ? "-" : currentShift}
              </span>
            </div>
          </div>

          <div className="indicator-box candidate-box">
            <span className="indicator-label">CANDIDATE PLAINTEXT AT SHIFT {attackStatus === "idle" ? "-" : currentShift}</span>
            <div className="candidate-preview-text">
              <code>{attackStatus === "idle" ? "(Awaiting attack launch...)" : liveCandidate}</code>
            </div>
          </div>

          <div className="indicator-box">
            <span className="indicator-label">ATTACK STATUS</span>
            <div className="indicator-status-text">
              {attackStatus === "running" && <span className="text-running">⚡ Testing Key {currentShift} of 25...</span>}
              {attackStatus === "paused" && <span className="text-paused">⏸ Attack Paused</span>}
              {attackStatus === "completed" && <span className="text-completed">✓ All 26 Shifts Tested</span>}
              {attackStatus === "idle" && <span className="text-idle">Standby</span>}
            </div>
          </div>
        </div>
      </div>

      {/* RECOVERED PLAINTEXT CARD */}
      {selectedAttempt && (
        <div className="recovered-plaintext-card">
          <div className="recovered-header">
            <div className="recovered-title">
              <span className="recovered-icon">🎯</span>
              <div>
                <h4>Recovered Plaintext Identified</h4>
                <p>
                  Brute force generates all possible plaintext candidates. The analyst identifies the meaningful plaintext.
                </p>
              </div>
            </div>
            <div className="recovered-actions">
              {copied && <span className="copied-pill">✓ Copied!</span>}
              <button
                type="button"
                className="lab-btn secondary-btn small-btn"
                onClick={() => handleCopy(selectedAttempt.candidate)}
              >
                📋 Copy Plaintext
              </button>
            </div>
          </div>

          <div className="recovered-body">
            <div className="recovered-meta">
              <span>Identified Key</span>
              <strong>Caesar Shift K = {selectedAttempt.shift}</strong>
            </div>
            <div className="recovered-content">
              <span>Plaintext Message</span>
              <code>{selectedAttempt.candidate}</code>
            </div>
          </div>
        </div>
      )}

      {/* STATS GRID */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔑</div>
          <div>
            <strong>26</strong>
            <span>Total Keys in Space</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <strong>{keysTestedCount} / 26</strong>
            <span>Keys Tested</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div>
            <strong>{progressPercent}%</strong>
            <span>Attack Progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div>
            <strong>{attempts.length}</strong>
            <span>Candidates Generated</span>
          </div>
        </div>
      </section>

      {/* 26-ROW EXHAUSTIVE RESULTS TABLE */}
      <BruteForceResults
        attempts={attempts}
        currentShift={currentShift}
        isRunning={attackStatus === "running"}
        selectedShift={selectedShift}
        onSelectCandidate={(shift) => setSelectedShift(shift)}
      />

      {/* EDUCATIONAL & VIVA EXPLANATION */}
      <BruteForceInfo />
    </div>
  );
}
