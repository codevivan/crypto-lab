/**
 * PracticeLab — Interactive Cryptographic Learning Game & Laboratory
 *
 * Upgraded university-grade interactive cryptography workspace for CryptoBreak Lab.
 * Features:
 *   - 5 dedicated labs with 6 interactive tasks each (100 points per lab, 500 total).
 *   - Progression & status tracking: Locked, Available, In Progress, Completed.
 *   - Completion rule: Completed ONLY when all tasks in a lab are solved AND score = 100.
 *   - Milestone Achievement Badges (7 collectible commendations).
 *   - Dedicated interactive task workspace with real crypto controls (inputs, dropdowns,
 *     sliders, brute-force engines, substitution mappers, and instant feedback).
 *   - Reset Task capability to enable 100% completion recovery.
 *   - Progressive hints with transparent point costs.
 *   - Seamless Light/Dark theme integration and responsive UI.
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { LABS, normalizeText } from "../data/labs";
import { encrypt as caesarEncrypt, decrypt as caesarDecrypt } from "../crypto/caesar";
import {
  encrypt as affineEncrypt,
  decrypt as affineDecrypt,
  modInverse,
} from "../crypto/affine";
import { getIntermediate } from "../crypto/product";
import { getSortedFrequencies } from "../crypto/analysis";
import { STANDARD_ALPHABET } from "../crypto/substitution";
import CertificateSection from "../components/CertificateSection";

// ──────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "cryptobreak-practice-progress";
const LETTER_LIST = STANDARD_ALPHABET.split("");

// Milestone Commendations
const ACHIEVEMENTS = [
  {
    id: "first_breakthrough",
    title: "First Breakthrough",
    icon: "🎯",
    description: "Complete your very first cryptography task.",
    check: (allStates) => {
      return Object.values(allStates || {}).some((labState) =>
        Object.values(labState || {}).some((ts) => ts?.completed)
      );
    },
  },
  {
    id: "caesar_sleuth",
    title: "Caesar Sleuth",
    icon: "🏛️",
    description: "Score a perfect 100/100 on Caesar Cipher Investigation.",
    check: (allStates) => {
      const state = allStates?.[1] || {};
      const lab = LABS[0];
      const done = lab.tasks.every((t) => state[t.id]?.completed);
      const score = lab.tasks.reduce((acc, t) => acc + (state[t.id]?.pointsEarned || 0), 0);
      return done && score === 100;
    },
  },
  {
    id: "affine_architect",
    title: "Affine Architect",
    icon: "📐",
    description: "Score a perfect 100/100 on Affine Cipher Workshop.",
    check: (allStates) => {
      const state = allStates?.[2] || {};
      const lab = LABS[1];
      const done = lab.tasks.every((t) => state[t.id]?.completed);
      const score = lab.tasks.reduce((acc, t) => acc + (state[t.id]?.pointsEarned || 0), 0);
      return done && score === 100;
    },
  },
  {
    id: "pipeline_specialist",
    title: "Pipeline Specialist",
    icon: "🔗",
    description: "Score a perfect 100/100 on Product Cipher Laboratory.",
    check: (allStates) => {
      const state = allStates?.[3] || {};
      const lab = LABS[2];
      const done = lab.tasks.every((t) => state[t.id]?.completed);
      const score = lab.tasks.reduce((acc, t) => acc + (state[t.id]?.pointsEarned || 0), 0);
      return done && score === 100;
    },
  },
  {
    id: "frequency_decoder",
    title: "Frequency Sleuth",
    icon: "📊",
    description: "Score a perfect 100/100 on Substitution & Frequency Analysis.",
    check: (allStates) => {
      const state = allStates?.[4] || {};
      const lab = LABS[3];
      const done = lab.tasks.every((t) => state[t.id]?.completed);
      const score = lab.tasks.reduce((acc, t) => acc + (state[t.id]?.pointsEarned || 0), 0);
      return done && score === 100;
    },
  },
  {
    id: "elite_cryptanalyst",
    title: "Elite Cryptanalyst",
    icon: "🕵️",
    description: "Score a perfect 100/100 on Cryptanalysis Mission.",
    check: (allStates) => {
      const state = allStates?.[5] || {};
      const lab = LABS[4];
      const done = lab.tasks.every((t) => state[t.id]?.completed);
      const score = lab.tasks.reduce((acc, t) => acc + (state[t.id]?.pointsEarned || 0), 0);
      return done && score === 100;
    },
  },
  {
    id: "grandmaster",
    title: "Cryptographic Grandmaster",
    icon: "👑",
    description: "Achieve the absolute maximum score of 500/500 across all 5 labs.",
    check: (allStates) => {
      let total = 0;
      LABS.forEach((lab) => {
        const state = allStates?.[lab.id] || {};
        total += lab.tasks.reduce((acc, t) => acc + (state[t.id]?.pointsEarned || 0), 0);
      });
      return total === 500;
    },
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────────────────
function getPerformanceLabel(score, max) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct >= 100) return "Mastery (100%)";
  if (pct >= 85) return "Excellent";
  if (pct >= 70) return "Very Good";
  if (pct >= 50) return "Proficient";
  return "In Training";
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
    // Graceful degrade
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

function formatEvidenceKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Computes status for a given lab: "completed" | "in-progress" | "available"
 * Open Access: All five labs are immediately accessible in any order.
 * Rule: Completed only when all tasks are solved AND score === 100.
 */
function getLabStatus(lab, allTaskStates) {
  const labTasks = lab.tasks;
  const labTaskStates = allTaskStates?.[lab.id] || {};
  const tasksCompleted = labTasks.filter((t) => labTaskStates[t.id]?.completed).length;
  const currentScore = labTasks.reduce(
    (acc, t) => acc + (labTaskStates[t.id]?.pointsEarned || 0),
    0
  );

  // Strict completion rule
  if (tasksCompleted === labTasks.length && currentScore === 100) {
    return "completed";
  }

  if (tasksCompleted > 0) {
    return "in-progress";
  }

  // All labs are open and accessible immediately
  return "available";
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Lab Selection Dashboard
// ──────────────────────────────────────────────────────────────────────────────
function LabDashboard({ labs, allTaskStates, onStartLab, onResumeLab }) {
  // Aggregate stats across all 5 labs
  const labStats = useMemo(() => {
    return labs.map((lab) => {
      const status = getLabStatus(lab, allTaskStates);
      const lState = allTaskStates?.[lab.id] || {};
      const completedCount = lab.tasks.filter((t) => lState[t.id]?.completed).length;
      const score = lab.tasks.reduce((acc, t) => acc + (lState[t.id]?.pointsEarned || 0), 0);
      const firstIncompleteIdx = lab.tasks.findIndex((t) => !lState[t.id]?.completed);
      return {
        lab,
        status,
        completedCount,
        score,
        firstIncompleteIdx: firstIncompleteIdx === -1 ? 0 : firstIncompleteIdx,
      };
    });
  }, [labs, allTaskStates]);

  const completedLabsCount = labStats.filter((s) => s.status === "completed").length;
  const inProgressLabsCount = labStats.filter((s) => s.status === "in-progress").length;
  const totalEarnedPoints = labStats.reduce((acc, s) => acc + s.score, 0);
  const maxPossiblePoints = 500;
  const overallPct = Math.round((totalEarnedPoints / maxPossiblePoints) * 100);

  // Milestone Achievements
  const unlockedAchievements = useMemo(() => {
    return ACHIEVEMENTS.map((ach) => ({
      ...ach,
      unlocked: ach.check(allTaskStates),
    }));
  }, [allTaskStates]);

  return (
    <div className="practice-lab-page">
      {/* Header */}
      <header className="practice-lab-header">
        <div className="practice-lab-eyebrow">OPERATIONAL TRAINING LAB & SIMULATION</div>
        <h1 className="practice-lab-title">Practice Lab</h1>
        <p className="practice-lab-desc">
          Test and sharpen your cryptographic skills across 5 hands-on, interactive laboratories.
          Execute manual transformations, deduce hidden parameters, launch brute-force decryptions,
          and conduct realistic cryptanalytic operations.
        </p>
        <p className="practice-lab-subdesc">
          Each lab holds 100 points across 6 interactive tasks. Score a perfect 500/500 to attain
          the title of Cryptographic Grandmaster.
        </p>
      </header>

      {/* Progress Overview Section */}
      <section className="practice-lab-progress-section" aria-label="Laboratory Progress Overview">
        <div className="practice-lab-stats-grid">
          <div className="practice-stat-card">
            <span className="practice-stat-label">LABS COMPLETED</span>
            <strong className="practice-stat-value">{completedLabsCount} / 5</strong>
            <span className="practice-stat-sub">Strict 100 Pts Req.</span>
          </div>
          <div className="practice-stat-card">
            <span className="practice-stat-label">TOTAL SCORE</span>
            <strong className="practice-stat-value">{totalEarnedPoints} / {maxPossiblePoints}</strong>
            <span className="practice-stat-sub">Cumulative Points</span>
          </div>
          <div className="practice-stat-card">
            <span className="practice-stat-label">ACTIVE LABS</span>
            <strong className="practice-stat-value">{inProgressLabsCount} In Progress</strong>
            <span className="practice-stat-sub">Live Sessions</span>
          </div>
          <div className="practice-stat-card">
            <span className="practice-stat-label">OVERALL PROGRESS</span>
            <strong className="practice-stat-value">{overallPct}%</strong>
            <span className="practice-stat-sub">Academy Readiness</span>
          </div>
        </div>

        <div className="practice-overall-bar-card">
          <div className="practice-overall-bar-header">
            <span className="practice-overall-bar-title">OVERALL ACADEMY MASTERY PROGRESS</span>
            <span className="practice-overall-bar-pct">{overallPct}% ({totalEarnedPoints} / 500 PTS)</span>
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

      {/* Milestone Achievements Bar */}
      <section className="practice-achievements-section" aria-label="Milestone Commendations">
        <div className="practice-section-header">
          <h2 className="practice-section-title">FIELD COMMENDATIONS & ACHIEVEMENTS</h2>
          <p className="practice-section-desc">
            Earn milestone badges by solving forensic challenges and achieving perfect laboratory scores.
          </p>
        </div>
        <div className="practice-achievements-grid">
          {unlockedAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`practice-achievement-card ${ach.unlocked ? "unlocked" : "locked"}`}
              title={ach.description}
            >
              <div className="achievement-icon">{ach.icon}</div>
              <div className="achievement-info">
                <span className="achievement-title">{ach.title}</span>
                <span className="achievement-status">{ach.unlocked ? "✓ Unlocked" : "🔒 In Progress"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practical Experiments Section */}
      <section className="practice-experiments-section" aria-label="Practical Experiments">
        <div className="practice-section-header">
          <h2 className="practice-section-title">FIVE GUIDED CRYPTOGRAPHY LABORATORIES</h2>
          <p className="practice-section-desc">
            Progress sequentially through foundational shift mechanics up to advanced cryptanalysis.
          </p>
        </div>

        <div className="practice-cards-grid">
          {labStats.map(({ lab, status, completedCount, score, firstIncompleteIdx }) => {
            const isCompleted = status === "completed";
            const isInProgress = status === "in-progress";

            const progressPct = Math.round((completedCount / lab.tasks.length) * 100);

            return (
              <article
                key={lab.id}
                className={`practice-lab-card ${
                  isCompleted
                    ? "card-completed"
                    : isInProgress
                    ? "card-in-progress"
                    : "card-available"
                }`}
              >
                <div className="practice-card-header">
                  <span className="practice-card-exp-num">LAB {lab.number}</span>
                  <span
                    className={`practice-card-badge ${
                      isCompleted
                        ? "badge-completed"
                        : isInProgress
                        ? "badge-in-progress"
                        : "badge-available"
                    }`}
                  >
                    {isCompleted
                      ? "✓ Completed (100 Pts)"
                      : isInProgress
                      ? "● In Progress"
                      : "○ Available"}
                  </span>
                </div>

                <div className="practice-card-body">
                  <div className="practice-card-category">{lab.category}</div>
                  <h3 className="practice-card-title">{lab.title}</h3>
                  <p className="practice-card-desc">{lab.shortDescription}</p>

                  {/* Objective statement */}
                  <div className="practice-card-objective">
                    <span className="obj-label">Objective:</span> {lab.objective}
                  </div>

                  {isInProgress && (
                    <div className="practice-card-live-status">
                      <div className="practice-live-status-row">
                        <span className="live-status-label">Active Task</span>
                        <strong className="live-status-val">
                          Task {firstIncompleteIdx + 1} of {lab.tasks.length}
                        </strong>
                      </div>
                      <div className="practice-live-status-row">
                        <span className="live-status-label">Current Score</span>
                        <strong className="live-status-val">{score} / {lab.maxScore} Pts</strong>
                      </div>
                      <div className="practice-mini-track">
                        <div className="practice-mini-fill" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="practice-card-completed-status">
                      <div className="practice-completed-row">
                        <span className="completed-label">Final Evaluated Score</span>
                        <strong className="completed-val">{score} / {lab.maxScore} PTS</strong>
                      </div>
                      <span className="practice-perf-chip">
                        {getPerformanceLabel(score, lab.maxScore)}
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
                    <span className="meta-label">EST. DURATION</span>
                    <strong className="meta-value">{lab.estimatedTime}</strong>
                  </div>
                </div>

                <div className="practice-card-footer">
                  <button
                    type="button"
                    className={`practice-action-btn ${
                      isCompleted ? "btn-review" : isInProgress ? "btn-resume" : "btn-start"
                    }`}
                    onClick={() => {
                      if (isInProgress) {
                        onResumeLab(lab.id, firstIncompleteIdx);
                      } else {
                        onStartLab(lab.id);
                      }
                    }}
                    aria-label={`${
                      isCompleted ? "Review" : isInProgress ? "Continue" : "Start"
                    } Lab ${lab.number}: ${lab.title}`}
                  >
                    {isCompleted
                      ? "↺ Review Lab"
                      : isInProgress
                      ? "▶ Continue Lab"
                      : "▶ Start Lab"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Official Academy Certificate of Completion Section */}
      <CertificateSection labs={labs} allTaskStates={allTaskStates} />
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
          ← Return to Practice Labs
        </button>
        <div className="practice-nav-crumbs">
          <span>Practice Lab</span> / <strong>Lab {lab.number}: {lab.title}</strong>
        </div>
      </div>

      <div className="practice-guidelines-card">
        <div className="practice-guidelines-header">
          <div className="practice-exp-tag">LABORATORY BRIEFING — LAB {lab.number}</div>
          <h2 className="practice-guidelines-title">{lab.title}</h2>
          <div className="practice-guidelines-category">{lab.category}</div>
          <div className="practice-guidelines-meta-pills">
            <span className="guideline-pill">{lab.difficulty}</span>
            <span className="guideline-pill">{lab.estimatedTime}</span>
            <span className="guideline-pill">{lab.maxScore} Points Maximum</span>
            <span className="guideline-pill">{lab.tasks.length} Interactive Tasks</span>
          </div>
        </div>

        <div className="practice-guidelines-body">
          <section className="guideline-block">
            <h4 className="guideline-heading">Laboratory Objective</h4>
            <p className="guideline-text">{lab.objective}</p>
          </section>

          <section className="guideline-block">
            <h4 className="guideline-heading">Operational Tasks</h4>
            <ol className="guideline-ordered-list">
              {lab.guidelines.whatYouWillDo.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="guideline-block">
            <h4 className="guideline-heading">Cryptographic Principles Required</h4>
            <ul className="guideline-bullet-list">
              {lab.guidelines.whatYouNeedToKnow.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="guideline-block">
            <h4 className="guideline-heading">Grading & Rules of Engagement</h4>
            <ul className="guideline-bullet-list">
              {lab.guidelines.instructions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="guideline-summary-grid">
            <div className="guideline-summary-item">
              <span className="summary-label">Target Score</span>
              <strong className="summary-val">{lab.maxScore} points</strong>
            </div>
            <div className="guideline-summary-item">
              <span className="summary-label">Task Count</span>
              <strong className="summary-val">{lab.tasks.length} tasks</strong>
            </div>
            <div className="guideline-summary-item">
              <span className="summary-label">Estimated Time</span>
              <strong className="summary-val">{lab.estimatedTime}</strong>
            </div>
            <div className="guideline-summary-item">
              <span className="summary-label">Difficulty</span>
              <strong className="summary-val">{lab.difficulty}</strong>
            </div>
          </div>
        </div>

        <div className="practice-guidelines-footer">
          <button
            type="button"
            className="practice-action-btn btn-start large"
            onClick={onStart}
            aria-label={`Enter Lab ${lab.number} Workspace`}
          >
            ▶ Launch Laboratory Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Progress Header
// ──────────────────────────────────────────────────────────────────────────────
function TaskProgressHeader({
  lab,
  currentTaskIndex,
  taskStates,
  totalScore,
  onSelectTask,
}) {
  const currentTaskNum = currentTaskIndex + 1;
  const progressPct = Math.round((currentTaskNum / lab.tasks.length) * 100);

  return (
    <div className="practice-task-header-card">
      <div className="task-header-top-row">
        <div>
          <div className="practice-exp-tag">LAB {lab.number} WORKSPACE</div>
          <h2 className="task-header-lab-title">{lab.title}</h2>
          <div className="task-header-position">
            Task {currentTaskNum} of {lab.tasks.length} — {lab.difficulty} Difficulty
          </div>
        </div>
        <div className="task-header-score-box">
          <span className="score-box-label">CURRENT LAB SCORE</span>
          <div className="score-box-num">
            <strong>{totalScore}</strong> <span>/ {lab.maxScore} Points</span>
          </div>
        </div>
      </div>

      {/* Visible Progress Bar */}
      <div className="task-header-progress-track">
        <div
          className="task-header-progress-fill"
          style={{ width: `${Math.max(8, progressPct)}%` }}
        />
      </div>

      {/* Task Navigator Selector Pills */}
      <div className="task-header-indicators" role="tablist" aria-label="Task navigation">
        {lab.tasks.map((t, idx) => {
          const ts = taskStates[t.id];
          const isCurrent = idx === currentTaskIndex;
          const isDone = ts?.completed;
          return (
            <button
              key={t.id}
              type="button"
              className={`task-indicator-pill ${
                isDone ? "pill-done" : isCurrent ? "pill-current" : "pill-pending"
              }`}
              onClick={() => onSelectTask(idx)}
              title={`Task ${t.id}: ${t.title} (${isDone ? `${ts.pointsEarned} pts earned` : `${t.points} pts`})`}
              aria-label={`Go to Task ${t.id}`}
              aria-selected={isCurrent}
            >
              <span className="pill-num">
                {isDone ? `✓ T${t.id}` : `T${t.id}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Workspace
// ──────────────────────────────────────────────────────────────────────────────
function TaskWorkspace({
  task,
  taskIndex,
  totalTasks,
  taskState,
  onUpdateState,
  onVerify,
  onResetTask,
  onNextTask,
}) {
  const { type, given, options } = task;
  const isCompleted = taskState.completed;

  // Brute force candidates table
  const bruteCandidates = useMemo(() => {
    if (type !== "brute-force-action" && type !== "candidate-select") return [];
    const ct = given?.ciphertext || "";
    return Array.from({ length: 26 }, (_, k) => ({
      shift: k,
      text: caesarDecrypt(ct, k),
    }));
  }, [type, given]);

  // Frequency table
  const freqData = useMemo(() => {
    if (type !== "freq-observation") return [];
    const ct = given?.ciphertext || "";
    return getSortedFrequencies(ct).filter((f) => f.count > 0);
  }, [type, given]);

  // Live substitution candidate preview
  const liveCandidate = useMemo(() => {
    if (type !== "mapping-interactive") return "";
    return buildCandidate(given?.ciphertext || "", taskState.mapping || {});
  }, [type, given, taskState.mapping]);

  // Mapping duplicate detector for bijective constraint
  const mappingCollisions = useMemo(() => {
    if (type !== "mapping-interactive") return [];
    const counts = {};
    Object.entries(taskState.mapping || {}).forEach(([, p]) => {
      if (p) {
        counts[p] = (counts[p] || 0) + 1;
      }
    });
    return Object.keys(counts).filter((p) => counts[p] > 1);
  }, [type, taskState.mapping]);

  // Progressive Hint
  const handleHint = () => {
    const usedCount = taskState.hintsUsed;
    if (usedCount >= task.hints.length) return;
    const hint = task.hints[usedCount];
    const deduction = hint.cost || 3;
    onUpdateState({
      hintsUsed: usedCount + 1,
      availablePoints: Math.max(0, taskState.availablePoints - deduction),
      feedback: null,
    });
  };

  const hintAvailable = taskState.hintsUsed < task.hints.length && !isCompleted;
  const isLastTask = taskIndex >= totalTasks - 1;

  return (
    <div className="practice-task-workspace-card">
      {/* Workspace Header */}
      <div className="task-workspace-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div className="task-workspace-tag">
            TASK {task.id.toString().padStart(2, "0")} OF {totalTasks.toString().padStart(2, "0")}
          </div>
          {task.caseId && <span className="case-id-badge">{task.caseId}</span>}
        </div>
        <div className="task-workspace-points">
          {isCompleted
            ? `${taskState.pointsEarned} / ${task.points} Pts Earned`
            : `${taskState.availablePoints} / ${task.points} Pts Available`}
        </div>
      </div>

      <h3 className="task-workspace-title">{task.title}</h3>

      {/* Case File Scenario Dossier */}
      {task.scenario && (
        <div className="case-scenario-box">
          <div className="case-scenario-header">
            <span className="case-scenario-icon">📁</span>
            <span className="case-scenario-label">CASE FILE SCENARIO</span>
          </div>
          <p className="case-scenario-text">{task.scenario}</p>
        </div>
      )}

      {/* Forensic Investigation Objective */}
      {task.objective && (
        <div className="case-objective-box">
          <span className="case-obj-label">INVESTIGATION OBJECTIVE:</span>
          <span className="case-obj-text">{task.objective}</span>
        </div>
      )}

      <p className="task-workspace-desc">{task.description}</p>

      {/* Exhibit Evidence Dossier */}
      {task.evidence && Object.keys(task.evidence).length > 0 && (
        <div className="case-evidence-dossier">
          <div className="evidence-dossier-header">
            <span className="evidence-icon">🔍</span>
            <span>EXHIBIT EVIDENCE & INTERCEPT TELEMETRY</span>
          </div>
          <div className="evidence-cards-grid">
            {Object.entries(task.evidence).map(([k, v]) => (
              <div key={k} className="evidence-card">
                <span className="evidence-label">{formatEvidenceKey(k)}</span>
                <div className="evidence-content">
                  {typeof v === "string" && v.length > 50 ? (
                    <code className="evidence-code-block">{v}</code>
                  ) : typeof v === "string" && (v.includes("=") || v.includes("mod") || v.length > 20) ? (
                    <code className="evidence-code-inline">{v}</code>
                  ) : (
                    <span className="evidence-text">{String(v)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Given Experimental Parameters */}
      {given && (
        <div className="task-given-box">
          <div className="given-box-header">CRYPTOGRAPHIC PARAMETERS & SYSTEM STATE</div>
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
            {given.letter && (
              <div className="given-row">
                <span className="given-label">Target Letter</span>
                <code className="given-code">{given.letter} (x = {given.index})</code>
              </div>
            )}
            {given.a !== undefined && (
              <div className="given-row">
                <span className="given-label">Multiplier Key (a)</span>
                <code className="given-code">{given.a}</code>
              </div>
            )}
            {given.b !== undefined && (
              <div className="given-row">
                <span className="given-label">Additive Key (b)</span>
                <code className="given-code">{given.b}</code>
              </div>
            )}
            {given.a_inv !== undefined && (
              <div className="given-row">
                <span className="given-label">Modular Inverse a⁻¹</span>
                <code className="given-code">{given.a_inv}</code>
              </div>
            )}
            {given.caesarShift !== undefined && (
              <div className="given-row">
                <span className="given-label">Layer 1 Shift (K)</span>
                <code className="given-code">{given.caesarShift}</code>
              </div>
            )}
            {given.affineA !== undefined && (
              <div className="given-row">
                <span className="given-label">Layer 2 Key a</span>
                <code className="given-code">{given.affineA}</code>
              </div>
            )}
            {given.affineB !== undefined && (
              <div className="given-row">
                <span className="given-label">Layer 2 Key b</span>
                <code className="given-code">{given.affineB}</code>
              </div>
            )}
            {given.intermediate && (
              <div className="given-row">
                <span className="given-label">Intermediate Text</span>
                <code className="given-code">{given.intermediate}</code>
              </div>
            )}
            {given.alphabetSize && (
              <div className="given-row">
                <span className="given-label">Alphabet Modulus</span>
                <code className="given-code">m = {given.alphabetSize} (A=0..Z=25)</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INPUT CONTROLS ACCORDING TO TASK TYPE */}

      {/* Type: Text Answer */}
      {type === "text-answer" && (
        <div className="task-input-group">
          <label htmlFor={`task-text-${task.id}`} className="task-input-label">
            Your Forensic Plaintext/Ciphertext Input:
          </label>
          <input
            id={`task-text-${task.id}`}
            type="text"
            className="task-input-field"
            placeholder="Type your recovered answer here..."
            value={taskState.textInput}
            disabled={isCompleted}
            onChange={(e) => onUpdateState({ textInput: e.target.value, feedback: null })}
            aria-label="Text answer input"
          />
        </div>
      )}

      {/* Type: Number Answer */}
      {type === "number-answer" && (
        <div className="task-input-group">
          <label htmlFor={`task-num-${task.id}`} className="task-input-label">
            Computed Integer Value:
          </label>
          <input
            id={`task-num-${task.id}`}
            type="number"
            className="task-input-field"
            style={{ maxWidth: "240px" }}
            placeholder="Enter integer..."
            value={taskState.numberInput}
            disabled={isCompleted}
            onChange={(e) => onUpdateState({ numberInput: e.target.value, feedback: null })}
            aria-label="Numeric input"
          />
        </div>
      )}

      {/* Type: Multiple Choice */}
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
              aria-label={`Option ${String.fromCharCode(65 + idx)}: ${opt}`}
            >
              <span className="mc-option-radio">{String.fromCharCode(65 + idx)}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Type: Brute Force Action */}
      {type === "brute-force-action" && (
        <div className="task-input-group">
          {!taskState.bruteForceRan ? (
            <button
              type="button"
              className="practice-action-btn btn-start"
              style={{ alignSelf: "flex-start" }}
              onClick={() => onUpdateState({ bruteForceRan: true, feedback: null })}
              aria-label="Launch exhaustive brute force engine"
            >
              ▶ Run Exhaustive Brute-Force Engine
            </button>
          ) : (
            <>
              <div className="given-box-header" style={{ marginBottom: "8px" }}>
                ALL 26 KEY CANDIDATES EXHAUSTIVELY COMPUTED
              </div>
              <div className="brute-table-container">
                {bruteCandidates.map(({ shift, text }) => (
                  <div key={shift} className="brute-candidate-row">
                    <span style={{ color: "var(--primary)", fontWeight: 700, minWidth: "65px" }}>
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

      {/* Type: Candidate Select */}
      {type === "candidate-select" && (
        <div className="task-input-group">
          <div className="given-box-header" style={{ marginBottom: "8px" }}>
            SELECT THE INTELLIGIBLE CANDIDATE STREAM
          </div>
          <div className="brute-table-container">
            {bruteCandidates.map(({ shift, text }) => (
              <button
                key={shift}
                type="button"
                className={`brute-candidate-row ${
                  taskState.selectedCandidateShift === shift ? "selected" : ""
                }`}
                onClick={() =>
                  !isCompleted && onUpdateState({ selectedCandidateShift: shift, feedback: null })
                }
                disabled={isCompleted}
                aria-pressed={taskState.selectedCandidateShift === shift}
              >
                <span style={{ color: "var(--primary)", fontWeight: 700, minWidth: "65px" }}>
                  K = {shift.toString().padStart(2, "0")}
                </span>
                <span>{text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Type: Multi-Select */}
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

      {/* Type: Frequency Observation */}
      {type === "freq-observation" && (
        <div className="task-input-group">
          <div className="given-box-header" style={{ marginBottom: "8px" }}>
            CIPHERTEXT LETTER FREQUENCY DISTRIBUTION
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
              Most Frequent Ciphertext Letter:
            </label>
            <input
              id="freq-most-freq"
              type="text"
              maxLength={1}
              className="task-input-field"
              style={{
                maxWidth: "120px",
                textTransform: "uppercase",
                textAlign: "center",
                fontWeight: 700,
              }}
              placeholder="A–Z"
              value={taskState.freqMostFrequent}
              disabled={isCompleted}
              onChange={(e) =>
                onUpdateState({
                  freqMostFrequent: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                  feedback: null,
                })
              }
              aria-label="Enter the most frequent letter"
            />
          </div>
        </div>
      )}

      {/* Type: Mapping Hypothesis */}
      {type === "mapping-hypothesis" && (
        <div className="task-input-group">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div className="given-row">
              <span className="given-label">Ciphertext Outlier</span>
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
                style={{
                  width: "90px",
                  textTransform: "uppercase",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                }}
                placeholder="A–Z"
                value={taskState.mappingHypothesisInput}
                disabled={isCompleted}
                onChange={(e) =>
                  onUpdateState({
                    mappingHypothesisInput: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                    feedback: null,
                  })
                }
                aria-label="Hypothesized plaintext letter"
              />
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px" }}>
            Statistical analysis: In standard English prose, <strong>E</strong> is the single most frequent letter (~12.7%).
            The most frequent ciphertext letter is most likely an encryption of E.
          </p>
        </div>
      )}

      {/* Type: Mapping Interactive */}
      {type === "mapping-interactive" && (
        <div className="task-input-group">
          <div className="given-box-header" style={{ marginBottom: "8px" }}>
            SUBSTITUTION KEY MAPPER (ASSIGN PLAINTEXT VALUES TO CIPHERTEXT LETTERS)
          </div>

          {/* Bijective Constraint Warning */}
          {mappingCollisions.length > 0 && (
            <div className="mapping-collision-alert" role="alert">
              <span>⚠️ One-to-one constraint violation:</span>
              <span>
                Plaintext letter(s) <strong>{mappingCollisions.join(", ")}</strong> mapped to multiple ciphertext letters!
              </span>
            </div>
          )}

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
                    aria-label={`Map ciphertext ${ch} to plaintext`}
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

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              style={{ fontSize: "0.8rem", padding: "6px 12px" }}
              onClick={() => {
                onUpdateState({
                  mapping: {
                    ...(taskState.mapping || {}),
                    Z: "W",
                    Q: "N",
                    L: "I",
                    V: "S",
                    F: "C",
                    D: "A",
                  },
                  feedback: null,
                });
              }}
              disabled={isCompleted}
              aria-label="Fill discovered anchor clues"
            >
              ⚡ Fill Investigated Anchors (Z→W, Q→N, L→I, V→S)
            </button>
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              style={{ fontSize: "0.8rem", padding: "6px 12px" }}
              onClick={() => {
                onUpdateState({
                  mapping: task.given?.providedClues ? { ...task.given.providedClues } : {},
                  feedback: null,
                });
              }}
              disabled={isCompleted}
              aria-label="Reset mapper to initial clues"
            >
              ↺ Reset to Initial Clues
            </button>
          </div>

          <div className="candidate-live-box">
            <span className="candidate-preview-label">LIVE DECRYPTED PREVIEW:</span>
            <code className="candidate-live-code">{liveCandidate}</code>
          </div>
        </div>
      )}

      {/* Revealed Hints Box */}
      {taskState.hintsUsed > 0 && (
        <div className="task-hint-box">
          <div className="given-box-header">REVEALED INTELLIGENCE HINTS</div>
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

      {/* Verification Feedback: Error */}
      {taskState.feedback?.status === "error" && (
        <div className="task-feedback-box error" role="alert">
          <strong style={{ fontSize: "0.92rem" }}>✕ Verification Failed</strong>
          <p style={{ margin: "4px 0 0", fontSize: "0.88rem" }}>{taskState.feedback.message}</p>
        </div>
      )}

      {/* Verification Feedback: Forensic Cryptanalytic Debrief */}
      {isCompleted && (
        <div className="case-debrief-card" role="region" aria-label="Cryptographic Debrief">
          <div className="debrief-header">
            <div className="debrief-header-left">
              <span className="debrief-stamp">✓ VERIFIED</span>
              <span className="debrief-title">CRYPTANALYTIC DEBRIEF</span>
            </div>
            <span className="debrief-points">+{taskState.pointsEarned} Points Awarded</span>
          </div>
          <div className="debrief-body">
            <p className="debrief-text">{task.feedbackCorrect}</p>
          </div>
        </div>
      )}

      {/* Workspace Action Buttons */}
      <div className="task-actions-row">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {hintAvailable && (
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              onClick={handleHint}
              aria-label={`Reveal hint ${taskState.hintsUsed + 1} of ${task.hints.length} (−${task.hints[taskState.hintsUsed]?.cost || 3} pts)`}
            >
              💡 Hint {taskState.hintsUsed + 1}/{task.hints.length}
              {" "}(−{task.hints[taskState.hintsUsed]?.cost || 3} pts)
            </button>
          )}

          {/* Reset Task Button */}
          <button
            type="button"
            className="practice-action-btn btn-secondary"
            onClick={() => onResetTask(task.id)}
            title="Reset this task to clear input, restore available points to 100%, and retry."
            aria-label="Reset task input and points"
          >
            ↺ Reset Task
          </button>

          {taskState.hintsUsed > 0 && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
              Penalty: −{task.hints.slice(0, taskState.hintsUsed).reduce((s, h) => s + (h.cost || 3), 0)} pts
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!isCompleted ? (
            <button
              type="button"
              className="practice-action-btn btn-start"
              onClick={onVerify}
              aria-label={`Verify answer for task ${task.id}`}
            >
              Verify Answer
            </button>
          ) : (
            <button
              type="button"
              className="practice-action-btn btn-start"
              onClick={onNextTask}
              aria-label={isLastTask ? "View final laboratory results" : "Proceed to next task"}
            >
              {isLastTask ? "View Lab Results →" : "Next Task →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT: Task Completion Modal Overlay
// ──────────────────────────────────────────────────────────────────────────────
function TaskCompletionOverlay({
  task,
  taskIndex,
  totalTasks,
  pointsEarned,
  totalScore,
  maxScore,
  onContinue,
}) {
  const isLast = taskIndex >= totalTasks - 1;

  return (
    <div className="task-completion-overlay" role="dialog" aria-modal="true" aria-label="Task Completed">
      <div className="task-completion-card">
        <div className="task-completion-icon">✓</div>
        <div className="task-completion-header">TASK {task.id} SOLVED</div>
        <h3 className="task-completion-title">{task.title}</h3>
        <div className="task-completion-score-row">
          <div className="task-completion-score-item">
            <span className="score-item-label">Points Awarded</span>
            <strong className="score-item-val">+{pointsEarned}</strong>
          </div>
          <div className="task-completion-score-item">
            <span className="score-item-label">Lab Score</span>
            <strong className="score-item-val">{totalScore} / {maxScore}</strong>
          </div>
        </div>
        <p className="task-completion-desc">
          {task.feedbackCorrect || "Outstanding work. You have mastered this cryptographic objective."}
        </p>
        <button
          type="button"
          className="practice-action-btn btn-start large"
          onClick={onContinue}
          aria-label={isLast ? "View final laboratory results" : "Continue to next task"}
        >
          {isLast ? "View Lab Results →" : "Continue to Next Task →"}
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
  const isPerfect = totalScore === 100 && tasksCompleted === lab.tasks.length;
  const totalHints = Object.values(taskStates).reduce((acc, ts) => acc + (ts.hintsUsed || 0), 0);

  return (
    <div className="practice-lab-page">
      <div className="practice-screen-nav">
        <button type="button" className="practice-nav-back-btn" onClick={onBack}>
          ← Return to Practice Labs
        </button>
        <div className="practice-nav-crumbs">
          <span>Practice Lab</span> / <strong>Lab {lab.number} — Final Assessment</strong>
        </div>
      </div>

      <div className="practice-result-card">
        <div className="practice-exp-tag">
          {isPerfect ? "MISSION COMPLETED — FULL MASTERY EARNED" : "LABORATORY ATTEMPT EVALUATION"}
        </div>
        <h2 className="practice-result-lab-title">
          LAB {lab.number}: {lab.title}
        </h2>
        <p className="practice-result-subtitle">
          {isPerfect
            ? "Outstanding performance, Agent! You completed all tasks with a perfect 100/100 score. This lab is officially COMPLETED."
            : "Lab completed. Note: To mark this lab as officially COMPLETED on your Academy dashboard, you must earn all 100 points without hint penalties."}
        </p>

        <div className="result-score-banner">
          <span className="result-score-eyebrow">FINAL EVALUATED LAB SCORE</span>
          <div className="result-score-val">
            {totalScore} <span>/ {lab.maxScore} PTS</span>
          </div>
          <div className={`result-score-perf ${isPerfect ? "perf-excellent" : "perf-good"}`}>
            {perf}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="given-box-header">TASK EVALUATION BREAKDOWN</div>
          <div className="breakdown-table">
            <div className="breakdown-row breakdown-header-row">
              <span style={{ minWidth: "80px" }}>Task</span>
              <span style={{ flex: 1 }}>Description</span>
              <span style={{ minWidth: "100px", textAlign: "right" }}>Score Earned</span>
            </div>
            {lab.tasks.map((t) => {
              const ts = taskStates[t.id];
              const earned = ts?.pointsEarned || 0;
              return (
                <div key={t.id} className="breakdown-row">
                  <span style={{ minWidth: "80px", color: "var(--primary)", fontWeight: 700 }}>
                    Task {t.id}
                  </span>
                  <span style={{ flex: 1, color: "var(--text-primary)" }}>{t.title}</span>
                  <span
                    style={{
                      minWidth: "100px",
                      textAlign: "right",
                      fontWeight: 800,
                      color:
                        earned === t.points
                          ? "var(--success-mid)"
                          : earned > 0
                          ? "var(--primary)"
                          : "var(--text-tertiary)",
                    }}
                  >
                    {earned} / {t.points} Pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="result-meta-row">
          <div className="practice-stat-card" style={{ padding: "14px 18px" }}>
            <span className="practice-stat-label">Tasks Solved</span>
            <strong className="practice-stat-value" style={{ fontSize: "1.4rem" }}>
              {tasksCompleted} / {lab.tasks.length}
            </strong>
          </div>
          <div className="practice-stat-card" style={{ padding: "14px 18px" }}>
            <span className="practice-stat-label">Total Hints Consulted</span>
            <strong className="practice-stat-value" style={{ fontSize: "1.4rem" }}>
              {totalHints}
            </strong>
          </div>
        </div>

        <div className="result-actions-row">
          <button type="button" className="practice-action-btn btn-secondary" onClick={onReview}>
            Review Tasks
          </button>
          {!isPerfect && (
            <button type="button" className="practice-action-btn btn-resume" onClick={onRetry}>
              ↺ Retry for 100 Pts
            </button>
          )}
          <button type="button" className="practice-action-btn btn-start" onClick={onBack}>
            ← Return to Practice Labs
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT: PracticeLab
// ──────────────────────────────────────────────────────────────────────────────
export default function PracticeLab() {
  const [screen, setScreen] = useState("dashboard");
  const [activeLab, setActiveLab] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  // Persistence: Lab Progress
  const [labProgress, setLabProgress] = useState(() => {
    const saved = loadFromStorage();
    if (saved?.labProgress) return saved.labProgress;
    return buildInitialLabProgress(LABS);
  });

  // Persistence: Task States for all labs
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
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cryptobreak-progress-updated", {
          detail: { labProgress, allTaskStates },
        })
      );
    }
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

  // Start a fresh lab
  const handleStartLab = useCallback((labId) => {
    setActiveLab(labId);
    setCurrentTaskIndex(0);
    setShowCompletionOverlay(false);
    setScreen("guidelines");
  }, []);

  // Resume an active lab
  const handleResumeLab = useCallback((labId, taskIdx) => {
    setActiveLab(labId);
    setCurrentTaskIndex(taskIdx);
    setShowCompletionOverlay(false);
    setScreen("tasks");
  }, []);

  // Launch workspace from guidelines
  const handleStartExperiment = useCallback(() => {
    setScreen("tasks");
    setCurrentTaskIndex(0);
    setLabProgress((prev) => ({
      ...prev,
      [activeLab]: { ...prev[activeLab], status: "in-progress" },
    }));
  }, [activeLab]);

  // Update single task state
  const updateTaskState = useCallback((taskId, updates) => {
    setAllTaskStates((prev) => ({
      ...prev,
      [activeLab]: {
        ...prev[activeLab],
        [taskId]: { ...(prev[activeLab]?.[taskId] || {}), ...updates },
      },
    }));
  }, [activeLab]);

  // Reset a specific task so students can achieve 100%
  const handleResetTask = useCallback((taskId) => {
    if (!currentLab) return;
    const task = currentLab.tasks.find((t) => t.id === taskId);
    if (!task) return;
    updateTaskState(taskId, {
      completed: false,
      pointsEarned: 0,
      hintsUsed: 0,
      availablePoints: task.points,
      textInput: "",
      numberInput: "",
      selectedChoice: null,
      selectedCandidateShift: null,
      bruteForceRan: false,
      multiSelected: [],
      mappingHypothesisInput: "",
      mapping: task.given?.providedClues ? { ...task.given.providedClues } : {},
      freqMostFrequent: "",
      feedback: null,
    });
  }, [currentLab, updateTaskState]);

  // Verification engine delegated to src/crypto/*
  const handleVerify = useCallback(() => {
    if (!currentTask || !currentLab) return;
    const ts = taskStatesForLab[currentTask.id];
    if (!ts || ts.completed) return;

    let isCorrect = false;
    let errorMsg = currentTask.feedbackIncorrect;

    try {
      switch (currentTask.expectedKey) {
        // Caesar encrypt
        case "caesarEncrypt": {
          const expected = caesarEncrypt(currentTask.given.plaintext, currentTask.given.shift);
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Caesar decrypt
        case "caesarDecrypt": {
          const expected = caesarDecrypt(currentTask.given.ciphertext, currentTask.given.shift);
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Shift value
        case "shiftValue": {
          const entered = parseInt(ts.numberInput, 10);
          isCorrect = !isNaN(entered) && entered === currentTask.expectedValue;
          break;
        }

        // General Number input
        case "numberValue": {
          const entered = parseInt(ts.numberInput, 10);
          isCorrect = !isNaN(entered) && entered === currentTask.expectedValue;
          break;
        }

        // General Text input
        case "textValue": {
          isCorrect = normalizeText(ts.textInput) === normalizeText(currentTask.expectedValue);
          break;
        }

        // Single letter affine
        case "singleLetterAffine": {
          isCorrect = normalizeText(ts.textInput) === normalizeText(currentTask.expectedValue);
          break;
        }

        // Modular Inverse
        case "modInverseCalc": {
          const entered = parseInt(ts.numberInput, 10);
          const computedInv = modInverse(currentTask.given.a, currentTask.given.modulus || 26);
          isCorrect = !isNaN(entered) && entered === computedInv;
          break;
        }

        // Multiple choice
        case "multipleChoice": {
          isCorrect = ts.selectedChoice === currentTask.expectedValue;
          break;
        }

        // Brute force execution
        case "bruteForceRun": {
          isCorrect = !!ts.bruteForceRan;
          if (!isCorrect) {
            errorMsg = "Click 'Run Exhaustive Brute-Force' to generate all 26 key candidates.";
          }
          break;
        }

        // Candidate select
        case "candidateSelect": {
          isCorrect = ts.selectedCandidateShift === currentTask.given.correctShift;
          break;
        }

        // Coprime keys selection
        case "validAffineKeys": {
          const selected = [...(ts.multiSelected || [])].sort((a, b) => a - b);
          const expected = [...currentTask.expectedValues].sort((a, b) => a - b);
          isCorrect =
            selected.length === expected.length &&
            selected.every((v, i) => v === expected[i]);
          break;
        }

        // Affine encrypt
        case "affineEncrypt": {
          const expected = affineEncrypt(
            currentTask.given.plaintext,
            currentTask.given.a,
            currentTask.given.b
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Affine decrypt
        case "affineDecrypt": {
          const expected = affineDecrypt(
            currentTask.given.ciphertext,
            currentTask.given.a,
            currentTask.given.b
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Caesar intermediate in product cipher
        case "caesarEncryptIntermediate": {
          const expected = getIntermediate(
            currentTask.given.plaintext,
            currentTask.given.caesarShift
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Product encrypt final
        case "productEncryptFinal": {
          const expected = affineEncrypt(
            currentTask.given.intermediate,
            currentTask.given.affineA,
            currentTask.given.affineB
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Product reverse step 1 (Affine)
        case "productDecryptAffineStep": {
          const expected = affineDecrypt(
            currentTask.given.ciphertext,
            currentTask.given.affineA,
            currentTask.given.affineB
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Product reverse step 2 (Caesar)
        case "productDecryptCaesarStep": {
          const expected = caesarDecrypt(
            currentTask.given.intermediate,
            currentTask.given.caesarShift
          );
          isCorrect = normalizeText(ts.textInput) === normalizeText(expected);
          break;
        }

        // Frequency analysis: most frequent letter
        case "mostFrequentLetter": {
          isCorrect =
            normalizeText(ts.freqMostFrequent) ===
            normalizeText(currentTask.given.expectedMostFrequent);
          break;
        }

        // Mapping hypothesis
        case "mappingHypothesis": {
          isCorrect =
            normalizeText(ts.mappingHypothesisInput) ===
            normalizeText(currentTask.given.correctPlainLetter);
          break;
        }

        // Mapping interactive
        case "mappingInteractive": {
          const mappedValues = Object.values(ts.mapping || {}).filter(Boolean);
          const uniqueMapped = new Set(mappedValues);
          if (uniqueMapped.size < mappedValues.length) {
            isCorrect = false;
            errorMsg =
              "One-to-one constraint violation: Multiple ciphertext letters are mapped to the same plaintext letter.";
            break;
          }
          const candidate = buildCandidate(
            currentTask.given.ciphertext,
            ts.mapping || {}
          );
          isCorrect =
            normalizeText(candidate) === normalizeText(currentTask.given.expectedAnswer);
          break;
        }

        default:
          errorMsg = "Verification handler not defined.";
      }
    } catch (err) {
      errorMsg = `Forensic validation error: ${err.message}`;
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
        feedback: { status: "error", message: errorMsg || "Incorrect. Please review and try again." },
      });
    }
  }, [currentTask, currentLab, taskStatesForLab, updateTaskState]);

  // Continue to next task or results
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
        const tasksCompletedCount = currentLab.tasks.filter(
          (t) => newTaskStates?.[t.id]?.completed
        ).length;
        const isLabCompleted =
          tasksCompletedCount === currentLab.tasks.length && finalScore === 100;

        setLabProgress((lprev) => {
          const prevBest = lprev[activeLab]?.bestScore || 0;
          return {
            ...lprev,
            [activeLab]: {
              status: isLabCompleted ? "completed" : "in-progress",
              bestScore: Math.max(prevBest, finalScore),
              lastScore: finalScore,
              tasksCompleted: tasksCompletedCount,
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

  // Retry lab
  const handleRetry = useCallback(() => {
    if (!activeLab) return;
    const lab = LABS.find((l) => l.id === activeLab);
    const freshTasks = buildInitialTaskState(lab);
    setAllTaskStates((prev) => ({ ...prev, [activeLab]: freshTasks }));
    setCurrentTaskIndex(0);
    setShowCompletionOverlay(false);
    setScreen("tasks");
  }, [activeLab]);

  const handleBackToDashboard = () => {
    setScreen("dashboard");
    setActiveLab(null);
    setCurrentTaskIndex(0);
    setShowCompletionOverlay(false);
  };

  // Screen 1: Dashboard
  if (screen === "dashboard" || !activeLab) {
    return (
      <LabDashboard
        labs={LABS}
        allTaskStates={allTaskStates}
        onStartLab={handleStartLab}
        onResumeLab={handleResumeLab}
      />
    );
  }

  // Screen 2: Guidelines
  if (screen === "guidelines" && currentLab) {
    return (
      <GuidelinesScreen
        lab={currentLab}
        onStart={handleStartExperiment}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Screen 3: Results
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

  // Screen 4: Dedicated Task Workspace
  if (screen === "tasks" && currentLab && currentTask) {
    return (
      <div className="pl-task-screen practice-lab-page">
        <div className="practice-screen-nav">
          <button type="button" className="practice-nav-back-btn" onClick={handleBackToDashboard}>
            ← Return to Practice Labs
          </button>
          <div className="practice-nav-crumbs">
            <span>Practice Lab</span> / <span>Lab {currentLab.number}: {currentLab.title}</span> /{" "}
            <strong>Task {currentTaskIndex + 1} of {currentLab.tasks.length}</strong>
          </div>
        </div>

        {/* Task Progress Header with Interactive Task Pills */}
        <TaskProgressHeader
          lab={currentLab}
          currentTaskIndex={currentTaskIndex}
          taskStates={taskStatesForLab}
          totalScore={totalScore}
          onSelectTask={(idx) => setCurrentTaskIndex(idx)}
        />

        {/* Dedicated Task Workspace */}
        <TaskWorkspace
          task={currentTask}
          taskIndex={currentTaskIndex}
          totalTasks={currentLab.tasks.length}
          taskState={taskStatesForLab[currentTask.id] || {}}
          onUpdateState={(updates) => updateTaskState(currentTask.id, updates)}
          onVerify={handleVerify}
          onResetTask={handleResetTask}
          onNextTask={handleContinue}
        />

        {/* Modal Overlay after task verification */}
        {showCompletionOverlay && (
          <TaskCompletionOverlay
            task={currentTask}
            taskIndex={currentTaskIndex}
            totalTasks={currentLab.tasks.length}
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
