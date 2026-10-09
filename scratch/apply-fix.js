const fs = require('fs');

const replacementBlock = `              <span className="pill-icon">{isDone ? "✓" : isCurrent ? "●" : "○"}</span>
              <span className="pill-name">Task {t.id}</span>
              <span className="pill-pts">
                {ts?.pointsEarned !== undefined ? \`\${ts.pointsEarned} pts\` : \`\${t.points} pts\`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Completion Feedback Overlay
// ──────────────────────────────────────────────────────────────────────────────
function TaskCompletionOverlay({ task, pointsEarned, totalScore, maxScore, onContinue }) {
  return (
    <div className="practice-overlay-backdrop">
      <div className="practice-completion-modal">
        <div className="completion-modal-icon">✓</div>
        <h3 className="completion-modal-title">TASK COMPLETED</h3>
        <p className="completion-modal-msg">{task.feedbackCorrect}</p>

        <div className="completion-modal-stats">
          <div className="comp-stat-item">
            <span className="comp-label">Points Earned</span>
            <strong className="comp-value earned">+{pointsEarned}</strong>
          </div>
          <div className="comp-stat-item">
            <span className="comp-label">Current Score</span>
            <strong className="comp-value">{totalScore} / {maxScore}</strong>
          </div>
        </div>

        <button
          type="button"
          className="practice-action-btn btn-start"
          onClick={onContinue}
          autoFocus
        >
          Continue to Next Task →
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Workspace — renders the correct UI per task type
// ──────────────────────────────────────────────────────────────────────────────
function TaskWorkspace({ task, taskState, onUpdateState, onVerify }) {
  const { type, given, options } = task;
  const isCompleted = taskState.completed;

  // ── BruteForce: generate all 26 candidates
  const bruteCandidates = useMemo(() => {
    if (type !== "brute-force-action" && type !== "candidate-select") return [];
    const ct = given?.ciphertext || "";
    return Array.from({ length: 26 }, (_, k) => ({
      shift: k,
      text: caesarDecrypt(ct, k),
    }));
  }, [type, given]);

  // ── Frequency table for freq-observation task
  const freqData = useMemo(() => {
    if (type !== "freq-observation") return [];
    const ct = given?.ciphertext || "";
    return getSortedFrequencies(ct).filter((f) => f.count > 0);
  }, [type, given]);

  // ── Live candidate text for mapping-interactive
  const liveCandidate = useMemo(() => {
    if (type !== "mapping-interactive") return "";
    return buildCandidate(given?.ciphertext || "", taskState.mapping || {});
  }, [type, given, taskState.mapping]);

  const handleHint = () => {
    const usedCount = taskState.hintsUsed;
    if (usedCount >= task.hints.length) return;
    const hint = task.hints[usedCount];
    const deduction = hint.cost || 5;
    onUpdateState({
      hintsUsed: usedCount + 1,
      availablePoints: Math.max(0, taskState.availablePoints - deduction),
      feedback: null,
    });
  };

  const hintAvailable = taskState.hintsUsed < task.hints.length && !isCompleted;

  return (
    <div className="practice-task-workspace-card">
      {/* Task Header */}
      <div className="task-workspace-header">
        <div className="task-workspace-tag">TASK {task.id.toString().padStart(2, "0")}</div>
        <div className="task-workspace-points">{taskState.availablePoints} Points Available</div>
      </div>

      <h3 className="task-workspace-title">{task.title}</h3>
      <p className="task-workspace-desc">{task.description}</p>

      {/* Given data */}
      {given && (
        <div className="task-given-box">
          <div className="given-box-header">GIVEN EXPERIMENTAL PARAMETERS</div>
          <div className="given-box-grid">
            {given.plaintext && (
              <div className="given-row">
                <span className="given-label">Plaintext</span>
                <code className="given-code">{given.plaintext}</code>
              </div>
            )}
            {given.ciphertext && (
              <div className="given-row">
                <span className="given-label">Ciphertext</span>
                <code className="given-code">{given.ciphertext}</code>
              </div>
            )}
            {given.shift !== undefined && (
              <div className="given-row">
                <span className="given-label">Caesar Shift (K)</span>
                <code className="given-code">{given.shift}</code>
              </div>
            )}
            {given.a !== undefined && (
              <div className="given-row">
                <span className="given-label">Affine Key a</span>
                <code className="given-code">{given.a}</code>
              </div>
            )}
            {given.b !== undefined && (
              <div className="given-row">
                <span className="given-label">Affine Key b</span>
                <code className="given-code">{given.b}</code>
              </div>
            )}
            {given.caesarShift !== undefined && (
              <div className="given-row">
                <span className="given-label">Caesar Shift</span>
                <code className="given-code">{given.caesarShift}</code>
              </div>
            )}
            {given.affineA !== undefined && (
              <div className="given-row">
                <span className="given-label">Affine a</span>
                <code className="given-code">{given.affineA}</code>
              </div>
            )}
            {given.affineB !== undefined && (
              <div className="given-row">
                <span className="given-label">Affine b</span>
                <code className="given-code">{given.affineB}</code>
              </div>
            )}
            {given.description && (
              <div className="given-row" style={{ gridColumn: "1 / -1" }}>
                <span className="given-label">Pipeline Order</span>
                <span className="given-code" style={{ fontFamily: "inherit" }}>{given.description}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── text-answer ──────────────────────────────────────── */}
      {type === "text-answer" && (
        <div className="task-input-group">
          <label htmlFor={\`task-text-\${task.id}\`} className="task-input-label">
            Your Answer:
          </label>
          <input
            id={\`task-text-\${task.id}\`}
            type="text"
            className="task-input-field"
            placeholder="Enter your answer here..."
            value={taskState.textInput}
            disabled={isCompleted}
            onChange={(e) => onUpdateState({ textInput: e.target.value, feedback: null })}
            aria-label="Text answer input"
          />
        </div>
      )}

      {/* ── number-answer ─────────────────────────────────────── */}
      {type === "number-answer" && (
        <div className="task-input-group">
          <label htmlFor={\`task-num-\${task.id}\`} className="task-input-label">
            Your Answer (Shift value 0–25):
          </label>
          <input
            id={\`task-num-\${task.id}\`}
            type="number"
            min="0"
            max="25"
            className="task-input-field"
            style={{ maxWidth: "220px" }}
            placeholder="Enter shift value..."
            value={taskState.numberInput}
            disabled={isCompleted}
            onChange={(e) => onUpdateState({ numberInput: e.target.value, feedback: null })}
            aria-label="Numeric shift value input"
          />
        </div>
      )}

      {/* ── multiple-choice ──────────────────────────────────── */}
      {type === "multiple-choice" && (
        <div className="mc-options-container">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={\`mc-option-button \${taskState.selectedChoice === idx ? "selected" : ""}\`}
              onClick={() => !isCompleted && onUpdateState({ selectedChoice: idx, feedback: null })}
              disabled={isCompleted}
              aria-pressed={taskState.selectedChoice === idx}
              aria-label={\`Option \${idx + 1}: \${opt}\`}
            >
              <span className="mc-option-radio">{String.fromCharCode(65 + idx)}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── brute-force-action ───────────────────────────────── */}
      {type === "brute-force-action" && (
        <div className="task-input-group">
          {!taskState.bruteForceRan ? (
            <button
              type="button"
              className="practice-action-btn btn-start"
              style={{ alignSelf: "flex-start" }}
              onClick={() => onUpdateState({ bruteForceRan: true, feedback: null })}
              aria-label="Run brute force search on ciphertext"
            >
              ▶ Run Exhaustive Brute-Force
            </button>
          ) : (
            <>
              <div className="given-box-header" style={{ marginBottom: "8px" }}>
                ALL 26 SHIFT CANDIDATES GENERATED
              </div>
              <div className="brute-table-container">
                {bruteCandidates.map(({ shift, text }) => (
                  <div key={shift} className="brute-candidate-row">
                    <span style={{ color: "var(--primary)", fontWeight: 700, minWidth: "60px" }}>
                      K = {shift.toString().padStart(2, "0")}
                    </span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── candidate-select ─────────────────────────────────── */}
      {type === "candidate-select" && (
        <div className="task-input-group">
          <div className="given-box-header" style={{ marginBottom: "8px" }}>
            SELECT THE MEANINGFUL ENGLISH CANDIDATE
          </div>
          <div className="brute-table-container">
            {bruteCandidates.map(({ shift, text }) => (
              <button
                key={shift}
                type="button"
                className={\`brute-candidate-row \${taskState.selectedCandidateShift === shift ? "selected" : ""}\`}
                onClick={() => !isCompleted && onUpdateState({ selectedCandidateShift: shift, feedback: null })}
                disabled={isCompleted}
                aria-pressed={taskState.selectedCandidateShift === shift}
              >
                <span style={{ color: "var(--primary)", fontWeight: 700, minWidth: "60px" }}>
                  K = {shift.toString().padStart(2, "0")}
                </span>
                <span>{text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── multi-select ─────────────────────────────────────── */}
      {type === "multi-select" && (
        <div className="task-input-group">
          <p className="task-input-label">Select all valid coprime multiplier values (gcd(a, 26) = 1):</p>
          <div className="multiselect-container">
            {task.options.map((opt) => {
              const isSelected = taskState.multiSelected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={\`multiselect-btn \${isSelected ? "selected" : ""}\`}
                  onClick={() => {
                    if (isCompleted) return;
                    const current = taskState.multiSelected;
                    const next = isSelected
                      ? current.filter((v) => v !== opt.value)
                      : [...current, opt.value];
                    onUpdateState({ multiSelected: next, feedback: null });
                  }}
                  disabled={isCompleted}
                  aria-pressed={isSelected}
                  aria-label={opt.label}
                >
                  <span>{isSelected ? "✓" : "○"}</span>
                  <code>{opt.label}</code>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", marginTop: "6px" }}>
            Note: Only integers with gcd(a, 26) = 1 possess a modular multiplicative inverse modulo 26.
          </div>
        </div>
      )}

      {/* ── freq-observation ─────────────────────────────────── */}
      {type === "freq-observation" && (
        <div className="task-input-group">
          <div className="given-box-header" style={{ marginBottom: "8px" }}>
            CIPHERTEXT LETTER FREQUENCY TABLE
          </div>
          <div className="freq-table-container">
            <div className="freq-table-head">
              <span>Letter</span>
              <span>Count</span>
              <span>Frequency %</span>
            </div>
            {freqData.slice(0, 10).map((f) => (
              <div key={f.letter} className="freq-table-row">
                <strong>{f.letter}</strong>
                <span>{f.count}</span>
                <span>{f.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px" }}>
            <label htmlFor="freq-most-freq" className="task-input-label">
              Most Frequent Ciphertext Letter
            </label>
            <input
              id="freq-most-freq"
              type="text"
              maxLength={1}
              className="task-input-field"
              style={{ maxWidth: "120px", textTransform: "uppercase", textAlign: "center", fontWeight: 700 }}
              placeholder="A–Z"
              value={taskState.freqMostFrequent}
              disabled={isCompleted}
              onChange={(e) =>
                onUpdateState({ freqMostFrequent: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""), feedback: null })
              }
              aria-label="Enter the most frequent ciphertext letter"
            />
          </div>
        </div>
      )}

      {/* ── mapping-hypothesis ───────────────────────────────── */}
      {type === "mapping-hypothesis" && (
        <div className="task-input-group">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div className="given-row">
              <span className="given-label">Ciphertext Letter</span>
              <code className="given-code" style={{ fontSize: "1.2rem", fontWeight: 700, textAlign: "center" }}>
                {given?.cipherLetter}
              </code>
            </div>
            <div style={{ fontSize: "1.4rem", color: "var(--text-tertiary)" }}>→</div>
            <div className="given-row">
              <span className="given-label">Plaintext Hypothesis</span>
              <input
                type="text"
                maxLength={1}
                className="task-input-field"
                style={{ width: "80px", textTransform: "uppercase", textAlign: "center", fontSize: "1.2rem", fontWeight: 700 }}
                placeholder="A–Z"
                value={taskState.mappingHypothesisInput}
                disabled={isCompleted}
                onChange={(e) =>
                  onUpdateState({
                    mappingHypothesisInput: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                    feedback: null,
                  })
                }
                aria-label="Enter your hypothesis for the plaintext letter"
              />
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px" }}>
            Statistical analysis: In standard English prose, <strong>E</strong> is the single most frequent letter (~12.7%).
            The most frequent ciphertext letter is most likely an encryption of E.
          </p>
        </div>
      )}

      {/* ── mapping-interactive ──────────────────────────────── */}
      {type === "mapping-interactive" && (
        <div className="task-input-group">
          <div className="given-box-header" style={{ marginBottom: "8px" }}>
            SUBSTITUTION KEY MAPPER (ASSIGN PLAINTEXT LETTERS TO CIPHERTEXT LETTERS)
          </div>
          <div className="mapping-panel">
            {Array.from(new Set((given?.ciphertext || "").replace(/[^A-Z]/g, ""))).sort().map((ch) => {
              const isLocked = given?.providedClues?.[ch];
              const currentVal = taskState.mapping?.[ch] || "";
              return (
                <div key={ch} className="mapping-unit">
                  <div className="cipher-unit-label">{ch}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>↓</div>
                  <select
                    className="plain-unit-select"
                    value={currentVal}
                    disabled={!!isLocked || isCompleted}
                    onChange={(e) => {
                      const newMapping = { ...(taskState.mapping || {}), [ch]: e.target.value };
                      if (!e.target.value) delete newMapping[ch];
                      onUpdateState({ mapping: newMapping, feedback: null });
                    }}
                    aria-label={\`Map ciphertext letter \${ch} to plaintext\`}
                  >
                    <option value="">?</option>
                    {LETTER_LIST.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <div className="candidate-live-box">
            <span className="candidate-preview-label">LIVE DECRYPTED PREVIEW:</span>
            <code className="candidate-live-code">{liveCandidate}</code>
          </div>
        </div>
      )}

      {/* ── REVEALED HINTS ──────────────────────────────────── */}
      {taskState.hintsUsed > 0 && (
        <div className="task-hint-box">
          <div className="given-box-header">REVEALED HINTS</div>
          {task.hints.slice(0, taskState.hintsUsed).map((hint, idx) => (
            <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "4px" }}>
              <span className="task-workspace-points" style={{ color: "#d97706", borderColor: "rgba(217, 119, 6, 0.3)" }}>
                Hint {idx + 1}
              </span>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)" }}>{hint.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── ERROR FEEDBACK ──────────────────────────────────── */}
      {taskState.feedback?.status === "error" && (
        <div className="task-feedback-box error" role="alert">
          <strong style={{ fontSize: "0.92rem" }}>✕ Verification Failed</strong>
          <p style={{ margin: "4px 0 0", fontSize: "0.88rem" }}>{taskState.feedback.message}</p>
        </div>
      )}

      {/* ── ACTION BAR ──────────────────────────────────────── */}
      <div className="task-actions-row">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {hintAvailable && (
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              onClick={handleHint}
              aria-label={\`Reveal hint \${taskState.hintsUsed + 1} of \${task.hints.length} (−\${task.hints[taskState.hintsUsed]?.cost || 5} pts)\`}
            >
              💡 Hint {taskState.hintsUsed + 1}/{task.hints.length}
              {" "}(−{task.hints[taskState.hintsUsed]?.cost || 5} pts)
            </button>
          )}
          {taskState.hintsUsed > 0 && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
              Penalty: −{task.hints.slice(0, taskState.hintsUsed).reduce((s, h) => s + (h.cost || 5), 0)} pts
            </span>
          )}
        </div>
        {!isCompleted && (
          <button
            type="button"
            className="practice-action-btn btn-start"
            onClick={onVerify}
            aria-label={\`Verify answer for task \${task.id}\`}
          >
            Verify Answer
          </button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Final Result Screen
// ──────────────────────────────────────────────────────────────────────────────
function LabResultScreen({ lab, taskStates, totalScore, onBack, onRetry, onReview }) {
  const perf = getPerformanceLabel(totalScore, lab.maxScore);
  const tasksCompleted = lab.tasks.filter((t) => taskStates[t.id]?.completed).length;
  const totalHints = Object.values(taskStates).reduce((acc, ts) => acc + (ts.hintsUsed || 0), 0);

  return (
    <div className="practice-lab-page">
      <div className="practice-nav-bar">
        <button type="button" className="practice-back-btn" onClick={onBack}>
          ← Back to Practice Lab
        </button>
      </div>

      <div className="practice-result-card">
        <div className="practice-exp-tag">EXPERIMENT ASSESSMENT COMPLETED</div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "6px 0 12px", color: "var(--text-primary)" }}>
          LAB {lab.number}: {lab.title}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
          {perf === "Excellent" || perf === "Very Good"
            ? "Outstanding performance. You have successfully demonstrated mastery of this experiment's cryptanalytic concepts."
            : perf === "Good"
            ? "Solid understanding demonstrated. Review individual task solutions to improve precision."
            : "Experiment completed. Consider reviewing the corresponding theoretical concepts in the Learn module and retrying."}
        </p>

        <div className="result-score-banner">
          <span className="result-score-eyebrow">FINAL EVALUATED SCORE</span>
          <div className="result-score-val">
            {totalScore} <span>/ {lab.maxScore}</span>
          </div>
          <div className="result-score-perf">{perf}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="given-box-header">EXPERIMENT TASK BREAKDOWN</div>
          <div className="breakdown-table">
            <div className="breakdown-row" style={{ fontWeight: 700, background: "var(--surface-light, rgba(0,0,0,0.02))" }}>
              <span style={{ minWidth: "80px" }}>Task</span>
              <span style={{ flex: 1 }}>Description</span>
              <span style={{ minWidth: "90px", textAlign: "right" }}>Score</span>
            </div>
            {lab.tasks.map((t) => {
              const ts = taskStates[t.id];
              const earned = ts?.pointsEarned || 0;
              return (
                <div key={t.id} className="breakdown-row">
                  <span style={{ minWidth: "80px", color: "var(--primary)", fontWeight: 600 }}>Task {t.id}</span>
                  <span style={{ flex: 1, color: "var(--text-primary)" }}>{t.title}</span>
                  <span style={{ minWidth: "90px", textAlign: "right", fontWeight: 700, color: earned === t.points ? "#10b981" : earned > 0 ? "var(--primary)" : "var(--text-tertiary)" }}>
                    {earned} / {t.points}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="result-meta-row">
          <div className="practice-stat-card" style={{ padding: "14px 18px" }}>
            <span className="practice-stat-label">Tasks Completed</span>
            <strong className="practice-stat-value" style={{ fontSize: "1.4rem" }}>
              {tasksCompleted} / {lab.tasks.length}
            </strong>
          </div>
          <div className="practice-stat-card" style={{ padding: "14px 18px" }}>
            <span className="practice-stat-label">Total Hints Used</span>
            <strong className="practice-stat-value" style={{ fontSize: "1.4rem" }}>
              {totalHints}
            </strong>
          </div>
        </div>

        <div className="result-actions-row">
          <button type="button" className="practice-action-btn btn-secondary" onClick={onReview}>
            Review Tasks
          </button>
          <button type="button" className="practice-action-btn btn-secondary" onClick={onRetry}>
            ↺ Retry Experiment
          </button>
          <button type="button" className="practice-action-btn btn-start" onClick={onBack}>
            ← Return to Practice Lab
          </button>
        </div>
      </div>
    </div>
  );
}`;

let file = fs.readFileSync('src/modules/PracticeLab.jsx', 'utf8');
const lines = file.split(/\\r?\\n/);

// Find the start line: where task-indicator-pill is opened before line 445
let startIdx = -1;
for (let i = 430; i < 450; i++) {
  if (lines[i] && lines[i].includes('title={`Task ${t.id}: ${t.title}`}')) {
    startIdx = i + 1; // line after title=...
    break;
  }
}

// Find the end line: right before export default function PracticeLab
let endIdx = -1;
for (let i = 950; i < 1100; i++) {
  if (lines[i] && lines[i].includes('export default function PracticeLab')) {
    endIdx = i;
    // Walk back over empty or comment lines
    while (endIdx > 0 && (lines[endIdx - 1].trim() === '' || lines[endIdx - 1].includes('───────') || lines[endIdx - 1].includes('MAIN: PracticeLab'))) {
      endIdx--;
    }
    break;
  }
}

console.log('Replacing from line', startIdx + 1, 'to line', endIdx);

const newLines = [
  ...lines.slice(0, startIdx),
  replacementBlock,
  '',
  '// ──────────────────────────────────────────────────────────────────────────────',
  '// MAIN: PracticeLab',
  '// ──────────────────────────────────────────────────────────────────────────────',
  ...lines.slice(endIdx)
];

fs.writeFileSync('src/modules/PracticeLab.jsx', newLines.join('\\n'), 'utf8');
console.log('Replacement complete.');
