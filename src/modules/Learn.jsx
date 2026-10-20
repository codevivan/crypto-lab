import { useState, useMemo } from "react";
import { CONCEPTS, CONCEPTS_QUIZ } from "../data/concepts";
import ConceptCard from "../components/ConceptCard";
import ConceptQuiz from "../components/ConceptQuiz";

export default function Learn() {
  const [activeId, setActiveId] = useState(1);
  const [viewedIds, setViewedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState("concept"); // "concept" | "quiz"

  // Persistent quiz state across concept navigation and quiz view
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState({});
  const [quizSubmittedAnswers, setQuizSubmittedAnswers] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [quizShowResults, setQuizShowResults] = useState(false);

  const activeConcept = useMemo(
    () => CONCEPTS.find((c) => c.id === activeId) || CONCEPTS[0],
    [activeId]
  );

  const isViewed = viewedIds.has(activeId);
  const viewedCount = viewedIds.size;
  const progressPercent = Math.round((viewedCount / CONCEPTS.length) * 100);

  const submittedCount = useMemo(
    () =>
      Object.keys(quizSubmittedAnswers).filter((k) => quizSubmittedAnswers[k])
        .length,
    [quizSubmittedAnswers]
  );

  const totalScore = useMemo(
    () => Object.values(quizScores).reduce((sum, val) => sum + (val || 0), 0),
    [quizScores]
  );

  const quizState = {
    currentIndex: quizCurrentIndex,
    selectedAnswers: quizSelectedAnswers,
    submittedAnswers: quizSubmittedAnswers,
    scores: quizScores,
    showResults: quizShowResults,
  };

  const quizHandlers = {
    setCurrentIndex: setQuizCurrentIndex,
    setSelectedAnswers: setQuizSelectedAnswers,
    setSubmittedAnswers: setQuizSubmittedAnswers,
    setScores: setQuizScores,
    setShowResults: setQuizShowResults,
  };

  const handleToggleViewed = () => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      if (next.has(activeId)) {
        next.delete(activeId);
      } else {
        next.add(activeId);
      }
      return next;
    });
  };

  const handleSelectConcept = (id) => {
    setActiveId(id);
    setViewMode("concept");
  };

  const handlePrev = () => {
    if (activeId > 1) setActiveId(activeId - 1);
  };

  const handleNext = () => {
    if (activeId < CONCEPTS.length) {
      // Auto-mark current as viewed when advancing
      setViewedIds((prev) => new Set([...prev, activeId]));
      setActiveId(activeId + 1);
    } else {
      // On the last concept, advance directly to the assessment quiz
      setViewedIds((prev) => new Set([...prev, activeId]));
      setViewMode("quiz");
    }
  };

  const handleResetProgress = () => {
    setViewedIds(new Set());
    setActiveId(1);
  };

  return (
    <div className="learn-module">
      {/* HEADER */}
      <section className="module-intro">
        <div className="section-label">INTERACTIVE MINI-COURSE</div>
        <h2>Learn Cryptanalysis</h2>
        <p>
          Understand the mathematical concepts behind classical ciphers and cryptanalytic attacks before experimenting in the virtual laboratory.
        </p>
      </section>

      {/* TOP VIEW TABS */}
      <div className="learn-tabs-bar">
        <button
          type="button"
          className={`learn-tab-btn ${viewMode === "concept" ? "active" : ""}`}
          onClick={() => setViewMode("concept")}
        >
          📖 Theory Concepts (11 Topics)
        </button>
        <button
          type="button"
          className={`learn-tab-btn ${viewMode === "quiz" ? "active" : ""}`}
          onClick={() => setViewMode("quiz")}
        >
          📝 Laboratory Assessment Quiz ({CONCEPTS_QUIZ.length} Questions)
          {submittedCount > 0 && (
            <span className="tab-score-badge">
              {totalScore}/{CONCEPTS_QUIZ.length}
            </span>
          )}
        </button>
      </div>

      {/* PROGRESS BAR FOR CONCEPTS */}
      {viewMode === "concept" && (
        <div className="learn-progress-card">
          <div className="learn-progress-row">
            <div>
              <strong>Concepts Viewed</strong>
              <span>
                {viewedCount} of {CONCEPTS.length} concepts
              </span>
            </div>
            <div className="learn-progress-right">
              <span className="learn-progress-percent">{progressPercent}%</span>
              <button
                type="button"
                className="lab-btn secondary-btn small-btn"
                onClick={handleResetProgress}
                disabled={viewedCount === 0}
              >
                ↺ Reset Progress
              </button>
            </div>
          </div>
          <div className="progress-track-container" style={{ margin: "12px 0 0" }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT: NAV + CONTENT */}
      <div className="learn-layout">
        {/* LEFT SIDEBAR NAVIGATION */}
        <nav className="concept-nav-sidebar" aria-label="Concept Navigation">
          <span className="nav-section-label">TOPICS</span>
          {CONCEPTS.map((c) => {
            const done = viewedIds.has(c.id);
            const isCurrent = viewMode === "concept" && activeId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                className={`concept-nav-item ${isCurrent ? "active" : ""} ${
                  done ? "nav-done" : ""
                }`}
                onClick={() => handleSelectConcept(c.id)}
              >
                <span className="concept-nav-num">{c.number}</span>
                <span className="concept-nav-title">{c.title}</span>
                {done && <span className="nav-check">✓</span>}
              </button>
            );
          })}

          {/* ASSESSMENT SECTION IN SIDEBAR */}
          <span className="nav-section-label" style={{ marginTop: "18px" }}>
            ASSESSMENT
          </span>
          <button
            type="button"
            className={`concept-nav-item quiz-nav-btn ${
              viewMode === "quiz" ? "active" : ""
            }`}
            onClick={() => setViewMode("quiz")}
          >
            <span className="concept-nav-num">QZ</span>
            <span className="concept-nav-title">Assessment Quiz</span>
            {submittedCount > 0 && (
              <span className="nav-score-tag">
                {totalScore}/{CONCEPTS_QUIZ.length}
              </span>
            )}
          </button>
        </nav>

        {/* MAIN CONTENT AREA */}
        <div className="concept-content-area">
          {viewMode === "quiz" ? (
            <ConceptQuiz
              onBackToConcepts={() => setViewMode("concept")}
              externalState={quizState}
              externalHandlers={quizHandlers}
            />
          ) : (
            <>
              <ConceptCard
                concept={activeConcept}
                isViewed={isViewed}
                onToggleViewed={handleToggleViewed}
                quizState={quizState}
                quizHandlers={quizHandlers}
              />

              {/* PREV / NEXT NAVIGATION CONTROLS */}
              <div className="concept-nav-controls">
                <button
                  type="button"
                  className="lab-btn secondary-btn"
                  onClick={handlePrev}
                  disabled={activeId === 1}
                >
                  ← Previous
                </button>

                <div className="nav-position-pill">
                  {activeId} / {CONCEPTS.length}
                </div>

                {activeId < CONCEPTS.length ? (
                  <button
                    type="button"
                    className="lab-btn primary-btn"
                    onClick={handleNext}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="lab-btn primary-btn"
                    onClick={() => setViewMode("quiz")}
                  >
                    Take Assessment Quiz →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
