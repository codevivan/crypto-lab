/**
 * PracticeLab — Redesigned University Virtual Laboratory
 *
 * Screens:
 *   1. Dashboard / Lab Selection
 *   2. Experiment Guidelines
 *   3. Task Workspace (sequential tasks)
 *   4. Task Completion feedback
 *   5. Final Lab Result Screen
 *
 * Architecture:
 *   - All crypto validation delegated to src/crypto/* engines.
 *   - Progress persisted to localStorage under "cryptobreak-practice-progress".
 *   - Best-score per lab is preserved across retries.
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { LABS, normalizeText } from "../data/labs";
import { encrypt as caesarEncrypt, decrypt as caesarDecrypt } from "../crypto/caesar";
import { encrypt as affineEncrypt } from "../crypto/affine";
import {
  encrypt as productEncrypt,
  decrypt as productDecrypt,
  getIntermediate,
} from "../crypto/product";
import { getSortedFrequencies } from "../crypto/analysis";
import { STANDARD_ALPHABET } from "../crypto/substitution";

// ──────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "cryptobreak-practice-progress";
const LETTER_LIST = STANDARD_ALPHABET.split("");

// ──────────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────────
function getPerformanceLabel(score, max) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct >= 90) return "Excellent";
  if (pct >= 75) return "Very Good";
  if (pct >= 60) return "Good";
  if (pct >= 40) return "Needs Improvement";
  return "Keep Practising";
}

function buildInitialTaskState(lab) {
  const taskStates = {};
  lab.tasks.forEach((t) => {
    taskStates[t.id] = {
      completed: false,
      pointsEarned: 0,
      hintsUsed: 0,
      availablePoints: t.points,
      textInput: "",
      numberInput: "",
      selectedChoice: null,
      selectedCandidateShift: null,
      bruteForceRan: false,
      multiSelected: [],
      mappingHypothesisInput: "",
      mapping: t.given?.providedClues ? { ...t.given.providedClues } : {},
      freqMostFrequent: "",
      feedback: null,
    };
  });
  return taskStates;
}

function buildInitialLabProgress(labs) {
  const progress = {};
  labs.forEach((lab) => {
    progress[lab.id] = {
      status: "not-started",
      bestScore: 0,
      lastScore: 0,
      tasksCompleted: 0,
      hintsUsed: 0,
    };
  });
  return progress;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded or private browsing — degrade gracefully
  }
}

function buildCandidate(ciphertext, mapping) {
  let result = "";
  for (let i = 0; i < ciphertext.length; i++) {
    const ch = ciphertext[i].toUpperCase();
    if (ch >= "A" && ch <= "Z") {
      result += mapping[ch] || "•";
    } else {
      result += ciphertext[i];
    }
  }
  return result;
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Lab Selection Dashboard
// ──────────────────────────────────────────────────────────────────────────────
function LabDashboard({ labs, progress, allTaskStates, onStartLab, onResumeLab }) {
  const completed = Object.values(progress).filter((p) => p.status === "completed").length;
  const totalBest = Object.values(progress).reduce((acc, p) => acc + (p.bestScore || 0), 0);
  const maxPossible = labs.reduce((acc, l) => acc + l.maxScore, 0);
  const avgPct = completed > 0 ? Math.round((totalBest / (completed * 100)) * 100) : 0;
  const overallPct = Math.round((completed / labs.length) * 100);

  return (
    <div className="practice-lab-page">
      <header className="practice-lab-header">
        <div className="practice-lab-eyebrow">VIRTUAL LABORATORY ASSESSMENT</div>
        <h1 className="practice-lab-title">Practice Lab</h1>
        <p className="practice-lab-desc">
          Apply the cryptographic concepts learned in CryptoBreak Lab through guided practical experiments.
        </p>
        <p className="practice-lab-subdesc">
          Complete each experiment to progress from foundational cipher mechanics to practical cryptanalysis.
        </p>
      </header>

      <section className="practice-lab-progress-section" aria-label="Laboratory Progress Overview">
        <div className="practice-lab-stats-grid">
          <div className="practice-stat-card">
            <span className="practice-stat-label">EXPERIMENTS</span>
            <strong className="practice-stat-value">{completed} / {labs.length}</strong>
            <span className="practice-stat-sub">Completed</span>
          </div>
          <div className="practice-stat-card">
            <span className="practice-stat-label">TOTAL SCORE</span>
            <strong className="practice-stat-value">{totalBest} / {maxPossible}</strong>
            <span className="practice-stat-sub">Points</span>
          </div>
          <div className="practice-stat-card">
            <span className="practice-stat-label">AVERAGE</span>
            <strong className="practice-stat-value">{completed > 0 ? `${avgPct}%` : "—"}</strong>
            <span className="practice-stat-sub">Current Performance</span>
          </div>
          <div className="practice-stat-card">
            <span className="practice-stat-label">OVERALL PROGRESS</span>
            <strong className="practice-stat-value">{overallPct}%</strong>
            <span className="practice-stat-sub">{completed} of {labs.length} completed</span>
          </div>
        </div>

        <div className="practice-overall-bar-card">
          <div className="practice-overall-bar-header">
            <span className="practice-overall-bar-title">OVERALL LAB PROGRESS</span>
            <span className="practice-overall-bar-pct">{overallPct}%</span>
          </div>
          <div className="practice-progress-track">
            <div
              className="practice-progress-fill"
              style={{ width: `${overallPct}%` }}
              role="progressbar"
              aria-valuenow={overallPct}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </section>

      <section className="practice-experiments-section" aria-label="Practical Experiments">
        <div className="practice-section-header">
          <h2 className="practice-section-title">PRACTICAL EXPERIMENTS</h2>
          <p className="practice-section-desc">
            5 guided experiments designed to build your cryptanalysis skills.
          </p>
        </div>

        <div className="practice-cards-grid">
          {labs.map((lab) => {
            const lp = progress[lab.id] || {};
            const isDone = lp.status === "completed";
            const isStarted = lp.status === "in-progress";

            const labTaskStates = allTaskStates?.[lab.id] || {};
            const tasksCompleted = lab.tasks.filter((t) => labTaskStates[t.id]?.completed).length;
            const currentScore = lab.tasks.reduce(
              (acc, t) => acc + (labTaskStates[t.id]?.pointsEarned || 0),
              0
            );
            const firstIncompleteIdx = lab.tasks.findIndex((t) => !labTaskStates[t.id]?.completed);
            const currentTaskNum = firstIncompleteIdx === -1 ? lab.tasks.length : firstIncompleteIdx + 1;
            const inProgressPct = Math.round((tasksCompleted / lab.tasks.length) * 100);

            return (
              <article
                key={lab.id}
                className={`practice-lab-card ${
                  isDone ? "card-completed" : isStarted ? "card-in-progress" : "card-not-started"
                }`}
              >
                <div className="practice-card-header">
                  <span className="practice-card-exp-num">LAB {lab.number}</span>
                  <span
                    className={`practice-card-badge ${
                      isDone ? "badge-completed" : isStarted ? "badge-in-progress" : "badge-not-started"
                    }`}
                  >
                    {isDone ? "✓ Completed" : isStarted ? "● In Progress" : "● Not Started"}
                  </span>
                </div>

                <div className="practice-card-body">
                  <div className="practice-card-category">{lab.category}</div>
                  <h3 className="practice-card-title">{lab.title}</h3>
                  <p className="practice-card-desc">{lab.shortDescription}</p>

                  {isStarted && !isDone && (
                    <div className="practice-card-live-status">
                      <div className="practice-live-status-row">
                        <span className="live-status-label">Progress</span>
                        <strong className="live-status-val">Task {currentTaskNum} of {lab.tasks.length}</strong>
                      </div>
                      <div className="practice-live-status-row">
                        <span className="live-status-label">Current Score</span>
                        <strong className="live-status-val">{currentScore} / {lab.maxScore}</strong>
                      </div>
                      <div className="practice-mini-track">
                        <div className="practice-mini-fill" style={{ width: `${inProgressPct}%` }} />
                      </div>
                    </div>
                  )}

                  {isDone && (
                    <div className="practice-card-completed-status">
                      <div className="practice-completed-row">
                        <span className="completed-label">Score</span>
                        <strong className="completed-val">{lp.bestScore} / {lab.maxScore}</strong>
                      </div>
                      <span className="practice-perf-chip">
                        {getPerformanceLabel(lp.bestScore, lab.maxScore)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="practice-card-divider" />

                <div className="practice-card-meta-grid">
                  <div className="practice-meta-item">
                    <span className="meta-label">DIFFICULTY</span>
                    <strong className="meta-value">{lab.difficulty}</strong>
                  </div>
                  <div className="practice-meta-item">
                    <span className="meta-label">TASKS</span>
                    <strong className="meta-value">{lab.tasks.length} Tasks</strong>
                  </div>
                  <div className="practice-meta-item">
                    <span className="meta-label">MAX SCORE</span>
                    <strong className="meta-value">{lab.maxScore} Points</strong>
                  </div>
                  <div className="practice-meta-item">
                    <span className="meta-label">EST. TIME</span>
                    <strong className="meta-value">{lab.estimatedTime}</strong>
                  </div>
                </div>

                <div className="practice-card-footer">
                  <button
                    type="button"
                    className={`practice-action-btn ${
                      isDone ? "btn-review" : isStarted ? "btn-resume" : "btn-start"
                    }`}
                    onClick={() =>
                      isStarted
                        ? onResumeLab(lab.id, firstIncompleteIdx === -1 ? 0 : firstIncompleteIdx)
                        : onStartLab(lab.id)
                    }
                    aria-label={`${isDone ? "Review" : isStarted ? "Resume" : "Start"} Lab ${lab.number}: ${lab.title}`}
                  >
                    {isDone ? "↺ Review Lab" : isStarted ? "▶ Resume Lab" : "▶ Start Lab"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Guidelines Screen
// ──────────────────────────────────────────────────────────────────────────────
function GuidelinesScreen({ lab, onStart, onBack }) {
  return (
    <div className="practice-lab-page">
      <div className="practice-screen-nav">
        <button type="button" className="practice-nav-back-btn" onClick={onBack}>
          ← Back to Practice Lab
        </button>
        <div className="practice-nav-crumbs">
          <span>Practice Lab</span> / <strong>Experiment {lab.number}</strong>
        </div>
      </div>

      <div className="practice-guidelines-card">
        <div className="practice-guidelines-header">
          <div className="practice-exp-tag">EXPERIMENT {lab.number}</div>
          <h2 className="practice-guidelines-title">{lab.title}</h2>
          <div className="practice-guidelines-category">{lab.category}</div>
          <div className="practice-guidelines-meta-pills">
            <span className="guideline-pill">{lab.difficulty}</span>
            <span className="guideline-pill">{lab.estimatedTime}</span>
            <span className="guideline-pill">{lab.maxScore} Points Maximum</span>
          </div>
        </div>

        <div className="practice-guidelines-body">
          <section className="guideline-block">
            <h4 className="guideline-heading">Objective</h4>
            <p className="guideline-text">{lab.objective}</p>
          </section>

          <section className="guideline-block">
            <h4 className="guideline-heading">What You Will Do</h4>
            <ol className="guideline-ordered-list">
              {lab.guidelines.whatYouWillDo.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="guideline-block">
            <h4 className="guideline-heading">What You Need to Know</h4>
            <ul className="guideline-bullet-list">
              {lab.guidelines.whatYouNeedToKnow.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="guideline-block">
            <h4 className="guideline-heading">Instructions</h4>
            <ul className="guideline-bullet-list">
              {lab.guidelines.instructions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="guideline-summary-grid">
            <div className="guideline-summary-item">
              <span className="summary-label">Maximum Score</span>
              <strong className="summary-val">{lab.maxScore} points</strong>
            </div>
            <div className="guideline-summary-item">
              <span className="summary-label">Number of Tasks</span>
              <strong className="summary-val">{lab.tasks.length} tasks</strong>
            </div>
            <div className="guideline-summary-item">
              <span className="summary-label">Estimated Time</span>
              <strong className="summary-val">{lab.estimatedTime}</strong>
            </div>
            <div className="guideline-summary-item">
              <span className="summary-label">Difficulty Level</span>
              <strong className="summary-val">{lab.difficulty}</strong>
            </div>
          </div>
        </div>

        <div className="practice-guidelines-footer">
          <button
            type="button"
            className="practice-action-btn btn-start large"
            onClick={onStart}
            aria-label={`Start Experiment ${lab.number}: ${lab.title}`}
          >
            ▶ Start Experiment
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Progress Header
// ──────────────────────────────────────────────────────────────────────────────
function TaskProgressHeader({ lab, currentTaskIndex, taskStates, totalScore }) {
  return (
    <div className="practice-task-header-card">
      <div className="task-header-top-row">
        <div>
          <div className="practice-exp-tag">EXPERIMENT {lab.number}</div>
          <h2 className="task-header-lab-title">{lab.title}</h2>
          <span className="task-header-position">Task {currentTaskIndex + 1} of {lab.tasks.length}</span>
        </div>
        <div className="task-header-score-box">
          <span className="score-box-label">CURRENT SCORE</span>
          <div className="score-box-num">
            <strong>{totalScore}</strong> <span>/ {lab.maxScore} Points</span>
          </div>
        </div>
      </div>

      <div className="task-header-progress-track">
        <div
          className="task-header-progress-fill"
          style={{ width: `${Math.max(5, ((currentTaskIndex + 1) / lab.tasks.length) * 100)}%` }}
        />
      </div>

      <div className="task-header-indicators">
        {lab.tasks.map((t, idx) => {
          const ts = taskStates[t.id];
          const isCurrent = idx === currentTaskIndex;
          const isDone = ts?.completed;
          return (
            <div
              key={t.id}
              className={`task-indicator-pill ${
                isDone ? "pill-done" : isCurrent ? "pill-current" : "pill-pending"
              }`}
              title={`Task ${t.id}: ${t.title}`}
            >
              <span className="pill-num">{t.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Workspace
// ──────────────────────────────────────────────────────────────────────────────
function TaskWorkspace({ task, taskState, onUpdateState, onVerify }) {
  const { type, given, options } = task;
  const isCompleted = taskState.completed;

  const bruteCandidates = useMemo(() => {
    if (type !== "brute-force-action" && type !== "candidate-select") return [];
    const ct = given?.ciphertext || "";
    return Array.from({ length: 26 }, (_, k) => ({
      shift: k,
      text: caesarDecrypt(ct, k),
    }));
  }, [type, given]);

  const freqData = useMemo(() => {
    if (type !== "freq-observation") return [];
    const ct = given?.ciphertext || "";
    return getSortedFrequencies(ct).filter((f) => f.count > 0);
  }, [type, given]);

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
      <div className="task-workspace-header">
        <div className="task-workspace-tag">TASK {task.id.toString().padStart(2, "0")}</div>
        <div className="task-workspace-points">{taskState.availablePoints} Points Available</div>
      </div>

      <h3 className="task-workspace-title">{task.title}</h3>
      <p className="task-workspace-desc">{task.description}</p>

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

      {type === "text-answer" && (
        <div className="task-input-group">
          <label htmlFor={`task-text-${task.id}`} className="task-input-label">
            Your Answer:
          </label>
          <input
            id={`task-text-${task.id}`}
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

      {type === "number-answer" && (
        <div className="task-input-group">
          <label htmlFor={`task-num-${task.id}`} className="task-input-label">
            Your Answer (Shift value 0–25):
          </label>
          <input
            id={`task-num-${task.id}`}
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

      {type === "multiple-choice" && (
        <div className="mc-options-container">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={`mc-option-button ${taskState.selectedChoice === idx ? "selected" : ""}`}
              onClick={() => !isCompleted && onUpdateState({ selectedChoice: idx, feedback: null })}
              disabled={isCompleted}
              aria-pressed={taskState.selectedChoice === idx}
              aria-label={`Option ${idx + 1}: ${opt}`}
            >
              <span className="mc-option-radio">{String.fromCharCode(65 + idx)}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

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
                className={`brute-candidate-row ${taskState.selectedCandidateShift === shift ? "selected" : ""}`}
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
                  className={`multiselect-btn ${isSelected ? "selected" : ""}`}
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
                    aria-label={`Map ciphertext letter ${ch} to plaintext`}
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

      {taskState.feedback?.status === "error" && (
        <div className="task-feedback-box error" role="alert">
          <strong style={{ fontSize: "0.92rem" }}>✕ Verification Failed</strong>
          <p style={{ margin: "4px 0 0", fontSize: "0.88rem" }}>{taskState.feedback.message}</p>
        </div>
      )}

      <div className="task-actions-row">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {hintAvailable && (
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              onClick={handleHint}
              aria-label={`Reveal hint ${taskState.hintsUsed + 1} of ${task.hints.length} (−${task.hints[taskState.hintsUsed]?.cost || 5} pts)`}
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
            aria-label={`Verify answer for task ${task.id}`}
          >
            Verify Answer
          </button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Completion Overlay
// ──────────────────────────────────────────────────────────────────────────────
function TaskCompletionOverlay({ task, pointsEarned, totalScore, maxScore, onContinue }) {
  return (
    <div className="task-completion-overlay" role="dialog" aria-modal="true" aria-label="Task Completed">
      <div className="task-completion-card">
        <div className="task-completion-icon">✓</div>
        <div className="task-completion-header">TASK COMPLETED</div>
        <h3 className="task-completion-title">{task.title}</h3>
        <div className="task-completion-score-row">
          <div className="task-completion-score-item">
            <span className="score-item-label">Points Earned</span>
            <strong className="score-item-val">+{pointsEarned}</strong>
          </div>
          <div className="task-completion-score-item">
            <span className="score-item-label">Total Score</span>
            <strong className="score-item-val">{totalScore} / {maxScore}</strong>
          </div>
        </div>
        <p className="task-completion-desc">
          {task.feedbackCorrect || "Excellent work. You have completed this task successfully."}
        </p>
        <button
          type="button"
          className="practice-action-btn btn-start"
          onClick={onContinue}
          aria-label="Continue to next task"
        >
          Continue →
        </button>
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
      <div className="practice-screen-nav">
        <button type="button" className="practice-nav-back-btn" onClick={onBack}>
          ← Back to Practice Lab
        </button>
        <div className="practice-nav-crumbs">
          <span>Practice Lab</span> / <strong>Experiment {lab.number} — Result</strong>
        </div>
      </div>

      <div className="practice-result-card">
        <div className="practice-exp-tag">EXPERIMENT ASSESSMENT COMPLETED</div>
        <h2 className="practice-result-lab-title">
          LAB {lab.number}: {lab.title}
        </h2>
        <p className="practice-result-subtitle">
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
          <div className={`result-score-perf perf-${perf.toLowerCase().replace(/\s+/g, "")}`}>{perf}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="given-box-header">EXPERIMENT TASK BREAKDOWN</div>
          <div className="breakdown-table">
            <div className="breakdown-row breakdown-header-row">
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
                  <span style={{ minWidth: "90px", textAlign: "right", fontWeight: 700, color: earned === t.points ? "var(--success-mid)" : earned > 0 ? "var(--primary)" : "var(--text-tertiary)" }}>
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
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN: PracticeLab
// ──────────────────────────────────────────────────────────────────────────────
export default function PracticeLab() {
  const [screen, setScreen] = useState("dashboard");
  const [activeLab, setActiveLab] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  const [labProgress, setLabProgress] = useState(() => {
    const saved = loadFromStorage();
    if (saved?.labProgress) return saved.labProgress;
    return buildInitialLabProgress(LABS);
  });

  const [allTaskStates, setAllTaskStates] = useState(() => {
    const saved = loadFromStorage();
    if (saved?.allTaskStates) return saved.allTaskStates;
    const initial = {};
    LABS.forEach((lab) => {
      initial[lab.id] = buildInitialTaskState(lab);
    });
    return initial;
  });

  useEffect(() => {
    saveToStorage({ labProgress, allTaskStates });
  }, [labProgress, allTaskStates]);

  const currentLab = useMemo(() => LABS.find((l) => l.id === activeLab), [activeLab]);
  const taskStatesForLab = useMemo(
    () => (activeLab ? allTaskStates[activeLab] || {} : {}),
    [activeLab, allTaskStates]
  );
  const currentTask = currentLab?.tasks[currentTaskIndex];

  const totalScore = useMemo(() => {
    if (!currentLab) return 0;
    return currentLab.tasks.reduce(
      (acc, t) => acc + (taskStatesForLab[t.id]?.pointsEarned || 0),
      0
    );
  }, [currentLab, taskStatesForLab]);

  const handleStartLab = useCallback((labId) => {
    const lp = labProgress[labId];
    if (lp?.status === "completed") {
      if (!window.confirm("Reset this experiment? Your previous score will be replaced only if you complete it again with a higher score. Best score is preserved.")) {
        return;
      }
      const lab = LABS.find((l) => l.id === labId);
      const freshTasks = buildInitialTaskState(lab);
      setAllTaskStates((prev) => ({ ...prev, [labId]: freshTasks }));
    }
    setActiveLab(labId);
    setCurrentTaskIndex(0);
    setShowCompletionOverlay(false);
    setScreen("guidelines");
  }, [labProgress]);

  const handleResumeLab = useCallback((labId, taskIdx) => {
    setActiveLab(labId);
    setCurrentTaskIndex(taskIdx);
    setShowCompletionOverlay(false);
    setScreen("tasks");
  }, []);

  const handleStartExperiment = useCallback(() => {
    setScreen("tasks");
    setCurrentTaskIndex(0);
    setLabProgress((prev) => ({
      ...prev,
      [activeLab]: { ...prev[activeLab], status: "in-progress" },
    }));
  }, [activeLab]);

  const updateTaskState = useCallback((taskId, updates) => {
    setAllTaskStates((prev) => ({
      ...prev,
      [activeLab]: {
        ...prev[activeLab],
        [taskId]: { ...(prev[activeLab]?.[taskId] || {}), ...updates },
      },
    }));
  }, [activeLab]);

  const handleVerify = useCallback(() => {
    if (!currentTask || !currentLab) return;
    const ts = taskStatesForLab[currentTask.id];
    if (!ts || ts.completed) return;

    let isCorrect = false;
    let errorMsg;

    try {
      switch (currentTask.expectedKey) {
        case "caesarEncrypt": {
          const expected = caesarEncrypt(currentTask.given.plaintext, currentTask.given.shift);
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "caesarDecrypt": {
          const expected = caesarDecrypt(currentTask.given.ciphertext, currentTask.given.shift);
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "shiftValue": {
          const entered = parseInt(ts.numberInput, 10);
          isCorrect = !isNaN(entered) && entered === currentTask.expectedValue;
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "multipleChoice": {
          isCorrect = ts.selectedChoice === currentTask.expectedValue;
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "bruteForceRun": {
          isCorrect = ts.bruteForceRan;
          errorMsg = "Click 'Run Brute Force' to generate the candidate list.";
          break;
        }
        case "candidateSelect": {
          isCorrect = ts.selectedCandidateShift === currentTask.given.correctShift;
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "validAffineKeys": {
          const selected = [...(ts.multiSelected || [])].sort();
          const expected = [...currentTask.expectedValues].sort();
          isCorrect =
            selected.length === expected.length &&
            selected.every((v, i) => v === expected[i]);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "affineEncrypt": {
          const expected = affineEncrypt(
            currentTask.given.plaintext,
            currentTask.given.a,
            currentTask.given.b
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "caesarEncryptIntermediate": {
          const expected = getIntermediate(
            currentTask.given.plaintext,
            currentTask.given.caesarShift
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "productDecrypt": {
          const plaintext = currentTask.expectedPlaintext;
          const cipher = productEncrypt(
            plaintext,
            currentTask.given.caesarShift,
            currentTask.given.affineA,
            currentTask.given.affineB
          );
          const recovered = productDecrypt(
            cipher,
            currentTask.given.caesarShift,
            currentTask.given.affineA,
            currentTask.given.affineB
          );
          isCorrect =
            normalizeText(ts.textInput) === normalizeText(recovered) ||
            normalizeText(ts.textInput) === normalizeText(plaintext);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "mostFrequentLetter": {
          isCorrect =
            ts.freqMostFrequent === currentTask.given.expectedMostFrequent;
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "mappingHypothesis": {
          isCorrect =
            ts.mappingHypothesisInput === currentTask.given.correctPlainLetter;
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "mappingInteractive": {
          const candidate = buildCandidate(
            currentTask.given.ciphertext,
            ts.mapping || {}
          );
          isCorrect =
            normalizeText(candidate) === normalizeText(currentTask.given.expectedAnswer);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        case "freqAnalysisPlaintext": {
          isCorrect =
            normalizeText(ts.textInput) ===
            normalizeText(currentTask.given.expectedAnswer);
          errorMsg = currentTask.feedbackIncorrect;
          break;
        }
        default:
          errorMsg = "Validation not implemented for this task type.";
      }
    } catch (err) {
      errorMsg = `Validation error: ${err.message}`;
    }

    if (isCorrect) {
      const pts = ts.availablePoints;
      updateTaskState(currentTask.id, {
        completed: true,
        pointsEarned: pts,
        feedback: { status: "correct" },
      });
      setShowCompletionOverlay(true);
    } else {
      updateTaskState(currentTask.id, {
        feedback: { status: "error", message: errorMsg || "Incorrect. Please try again." },
      });
    }
  }, [currentTask, currentLab, taskStatesForLab, updateTaskState]);

  const handleContinue = useCallback(() => {
    setShowCompletionOverlay(false);
    const isLast = currentTaskIndex >= currentLab.tasks.length - 1;
    if (isLast) {
      setAllTaskStates((prev) => {
        const newTaskStates = prev[activeLab];
        const finalScore = currentLab.tasks.reduce(
          (acc, t) => acc + (newTaskStates?.[t.id]?.pointsEarned || 0),
          0
        );
        setLabProgress((lprev) => {
          const prevBest = lprev[activeLab]?.bestScore || 0;
          return {
            ...lprev,
            [activeLab]: {
              status: "completed",
              bestScore: Math.max(prevBest, finalScore),
              lastScore: finalScore,
              tasksCompleted: currentLab.tasks.length,
              hintsUsed: currentLab.tasks.reduce(
                (acc, t) => acc + (newTaskStates?.[t.id]?.hintsUsed || 0),
                0
              ),
            },
          };
        });
        return prev;
      });
      setScreen("result");
    } else {
      setCurrentTaskIndex((i) => i + 1);
    }
  }, [currentTaskIndex, currentLab, activeLab]);

  const handleRetry = useCallback(() => {
    if (!activeLab) return;
    if (!window.confirm("Reset this experiment? Your best score is preserved if this attempt scores lower.")) return;
    const lab = LABS.find((l) => l.id === activeLab);
    const freshTasks = buildInitialTaskState(lab);
    setAllTaskStates((prev) => ({ ...prev, [activeLab]: freshTasks }));
    setCurrentTaskIndex(0);
    setShowCompletionOverlay(false);
    setScreen("guidelines");
  }, [activeLab]);

  const handleBackToDashboard = () => {
    setScreen("dashboard");
    setActiveLab(null);
    setCurrentTaskIndex(0);
    setShowCompletionOverlay(false);
  };

  if (screen === "dashboard" || !activeLab) {
    return (
      <LabDashboard
        labs={LABS}
        progress={labProgress}
        allTaskStates={allTaskStates}
        onStartLab={handleStartLab}
        onResumeLab={handleResumeLab}
      />
    );
  }

  if (screen === "guidelines" && currentLab) {
    return (
      <GuidelinesScreen
        lab={currentLab}
        onStart={handleStartExperiment}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (screen === "result" && currentLab) {
    const finalScore = currentLab.tasks.reduce(
      (acc, t) => acc + (taskStatesForLab[t.id]?.pointsEarned || 0),
      0
    );
    return (
      <LabResultScreen
        lab={currentLab}
        taskStates={taskStatesForLab}
        totalScore={finalScore}
        onBack={handleBackToDashboard}
        onRetry={handleRetry}
        onReview={() => {
          setCurrentTaskIndex(0);
          setScreen("tasks");
        }}
      />
    );
  }

  if (screen === "tasks" && currentLab && currentTask) {
    return (
      <div className="pl-task-screen practice-lab-page">
        <div className="practice-screen-nav">
          <button type="button" className="practice-nav-back-btn" onClick={handleBackToDashboard}>
            ← Practice Lab
          </button>
          <div className="practice-nav-crumbs">
            <span>Practice Lab</span> / <span>Experiment {currentLab.number}</span> / <strong>Task {currentTaskIndex + 1}</strong>
          </div>
        </div>

        <TaskProgressHeader
          lab={currentLab}
          currentTaskIndex={currentTaskIndex}
          taskStates={taskStatesForLab}
          totalScore={totalScore}
        />

        <TaskWorkspace
          task={currentTask}
          taskState={taskStatesForLab[currentTask.id] || {}}
          onUpdateState={(updates) => updateTaskState(currentTask.id, updates)}
          onVerify={handleVerify}
        />

        {showCompletionOverlay && (
          <TaskCompletionOverlay
            task={currentTask}
            pointsEarned={taskStatesForLab[currentTask.id]?.pointsEarned || 0}
            totalScore={totalScore}
            maxScore={currentLab.maxScore}
            onContinue={handleContinue}
          />
        )}
      </div>
    );
  }

  return null;
}
