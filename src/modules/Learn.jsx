import { useState, useMemo } from "react";
import { CONCEPTS } from "../data/concepts";
import ConceptCard from "../components/ConceptCard";

export default function Learn() {
  const [activeId, setActiveId] = useState(1);
  const [viewedIds, setViewedIds] = useState(new Set());

  const activeConcept = useMemo(
    () => CONCEPTS.find((c) => c.id === activeId) || CONCEPTS[0],
    [activeId]
  );

  const isViewed = viewedIds.has(activeId);
  const viewedCount = viewedIds.size;
  const progressPercent = Math.round((viewedCount / CONCEPTS.length) * 100);

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
  };

  const handlePrev = () => {
    if (activeId > 1) setActiveId(activeId - 1);
  };

  const handleNext = () => {
    if (activeId < CONCEPTS.length) {
      // Auto-mark current as viewed when advancing
      setViewedIds((prev) => new Set([...prev, activeId]));
      setActiveId(activeId + 1);
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
          Understand the concepts behind the attacks before experimenting in the virtual laboratory.
        </p>
      </section>

      {/* PROGRESS BAR */}
      <div className="learn-progress-card">
        <div className="learn-progress-row">
          <div>
            <strong>Concepts Viewed</strong>
            <span>{viewedCount} of {CONCEPTS.length} concepts</span>
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
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* MAIN LAYOUT: NAV + CONTENT */}
      <div className="learn-layout">
        {/* LEFT SIDEBAR NAVIGATION */}
        <nav className="concept-nav-sidebar" aria-label="Concept Navigation">
          <span className="nav-section-label">TOPICS</span>
          {CONCEPTS.map((c) => {
            const done = viewedIds.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                className={`concept-nav-item ${activeId === c.id ? "active" : ""} ${done ? "nav-done" : ""}`}
                onClick={() => handleSelectConcept(c.id)}
              >
                <span className="concept-nav-num">{c.number}</span>
                <span className="concept-nav-title">{c.title}</span>
                {done && <span className="nav-check">✓</span>}
              </button>
            );
          })}
        </nav>

        {/* MAIN CONTENT AREA */}
        <div className="concept-content-area">
          <ConceptCard
            concept={activeConcept}
            isViewed={isViewed}
            onToggleViewed={handleToggleViewed}
          />

          {/* PREV / NEXT NAVIGATION */}
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

            <button
              type="button"
              className="lab-btn primary-btn"
              onClick={handleNext}
              disabled={activeId === CONCEPTS.length}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
