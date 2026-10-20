import { useState, useEffect } from "react";
import "./index.css";
import CipherSimulator from "./modules/CipherSimulator";
import BruteForce from "./modules/BruteForce";
import FrequencyAnalysis from "./modules/FrequencyAnalysis";
import PracticeLab from "./modules/PracticeLab";
import Learn from "./modules/Learn";
import Feedback from "./modules/Feedback";
import CertificateSection from "./components/CertificateSection";
import { LABS } from "./data/labs";
import { evaluateCertificateEligibility } from "./utils/certificatePdf";

const STORAGE_KEY = "cryptobreak-practice-progress";

function buildInitialTaskState() {
  const initial = {};
  LABS.forEach((lab) => {
    initial[lab.id] = {};
    lab.tasks.forEach((t) => {
      initial[lab.id][t.id] = {
        completed: false,
        pointsEarned: 0,
        hintsUsed: 0,
        availablePoints: t.points,
      };
    });
  });
  return initial;
}

function loadSavedTaskStates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.allTaskStates) return parsed.allTaskStates;
    }
  } catch {
    // fallback
  }
  return buildInitialTaskState();
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cryptobreak-theme") || "light";
    } catch {
      return "light";
    }
  });

  const [allTaskStates, setAllTaskStates] = useState(loadSavedTaskStates);

  // Sync state reactively across pages when practice tasks are solved
  useEffect(() => {
    const handleProgressUpdate = () => {
      setAllTaskStates(loadSavedTaskStates());
    };

    window.addEventListener("cryptobreak-progress-updated", handleProgressUpdate);
    window.addEventListener("storage", handleProgressUpdate);
    return () => {
      window.removeEventListener("cryptobreak-progress-updated", handleProgressUpdate);
      window.removeEventListener("storage", handleProgressUpdate);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("cryptobreak-theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const modules = [
    {
      icon: "💥",
      title: "Brute Force Attack",
      description:
        "Explore how an attacker systematically tests possible keys to break a Caesar cipher.",
      page: "Brute Force",
    },
    {
      icon: "📊",
      title: "Frequency Analysis",
      description:
        "Analyze letter frequencies and use statistical patterns to recover a monoalphabetic cipher.",
      page: "Frequency Analysis",
    },
    {
      icon: "🔐",
      title: "Cipher Simulator",
      description:
        "Encrypt messages using Caesar and monoalphabetic substitution ciphers.",
      page: "Cipher Simulator",
    },
    {
      icon: "🧪",
      title: "Practice Lab",
      description:
        "Solve cryptanalysis challenges across 5 labs and test your understanding.",
      page: "Practice Lab",
    },
  ];

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">C</div>

          <div>
            <h2>CryptoBreak</h2>
            <span>Virtual Lab</span>
          </div>
        </div>

        <nav className="navigation">
          <p className="nav-title">MAIN MENU</p>

          <button
            className={`nav-item ${
              activePage === "Dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("Dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === "Cipher Simulator" ? "active" : ""
            }`}
            onClick={() => setActivePage("Cipher Simulator")}
          >
            <span>🔐</span>
            Cipher Simulator
          </button>

          <button
            className={`nav-item ${
              activePage === "Brute Force" ? "active" : ""
            }`}
            onClick={() => setActivePage("Brute Force")}
          >
            <span>💥</span>
            Brute Force
          </button>

          <button
            className={`nav-item ${
              activePage === "Frequency Analysis" ? "active" : ""
            }`}
            onClick={() => setActivePage("Frequency Analysis")}
          >
            <span>📊</span>
            Frequency Analysis
          </button>

          <button
            className={`nav-item ${
              activePage === "Practice Lab" ? "active" : ""
            }`}
            onClick={() => setActivePage("Practice Lab")}
          >
            <span>🧪</span>
            Practice Lab
          </button>

          <button
            className={`nav-item ${
              activePage === "Certificate" ? "active" : ""
            }`}
            onClick={() => setActivePage("Certificate")}
          >
            <span>📜</span>
            Certificate
          </button>

          <p className="nav-title learn-title">LEARN</p>

          <button
            className={`nav-item ${
              activePage === "Learn" ? "active" : ""
            }`}
            onClick={() => setActivePage("Learn")}
          >
            <span>📚</span>
            Concepts
          </button>
          <p className="nav-title learn-title">FEEDBACK</p>

          <button
            className={`nav-item ${
              activePage === "Feedback" ? "active" : ""
            }`}
            onClick={() => setActivePage("Feedback")}
          >
            <span>💬</span>
            Feedback
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-lab-status">
            <span className="sidebar-status-dot"></span>
            <span className="sidebar-status-text">Simulator Active</span>
          </div>
          <div className="student-box">
            <div className="student-avatar">VS</div>
            <div>
              <strong>Student Lab</strong>
              <span>CSS Virtual Lab</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">CryptoBreak Lab / {activePage}</p>
            <h1>{activePage}</h1>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              aria-label="Toggle theme mode"
            >
              <span className="theme-toggle-icon">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
              <span className="theme-toggle-text">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>

            <div className="status">
              <span className="status-dot"></span>
              Lab Ready
            </div>
          </div>
        </header>

        {activePage === "Dashboard" ? (
          <Dashboard
            modules={modules}
            setActivePage={setActivePage}
            allTaskStates={allTaskStates}
          />
        ) : activePage === "Cipher Simulator" ? (
          <CipherSimulator />
        ) : activePage === "Brute Force" ? (
          <BruteForce />
        ) : activePage === "Frequency Analysis" ? (
          <FrequencyAnalysis />
        ) : activePage === "Practice Lab" ? (
          <PracticeLab />
        ) : activePage === "Certificate" ? (
          <div className="practice-lab-page" style={{ padding: "0 0 40px" }}>
            <CertificateSection labs={LABS} allTaskStates={allTaskStates} />
          </div>
        ) : activePage === "Learn" ? (
          <Learn />
        ) : activePage === "Feedback" ? (
          <Feedback setActivePage={setActivePage} />
        ) : null}
      </main>
    </div>
  );
}

function Dashboard({ modules, setActivePage, allTaskStates }) {
  const certEval = evaluateCertificateEligibility(LABS, allTaskStates);

  return (
    <div className="dashboard">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label">CRYPTOGRAPHY & SYSTEM SECURITY</div>

          <h2>
            Monoalphabetic Cipher
            <br />
            <span>Cryptanalysis Lab</span>
          </h2>

          <p>
            Learn how cryptanalysts break substitution ciphers using
            brute-force attacks and frequency analysis.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
            <button
              className="primary-button"
              onClick={() => setActivePage("Cipher Simulator")}
            >
              Start Experiment →
            </button>
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              onClick={() => setActivePage("Certificate")}
              style={{ padding: "12px 20px", fontWeight: 700 }}
            >
              📜 View Certificate Progress
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="cipher-card">
            <div className="cipher-row">
              <span>PLAINTEXT</span>
              <strong>HELLO WORLD</strong>
            </div>

            <div className="arrow">↓</div>

            <div className="cipher-row">
              <span>CIPHERTEXT</span>
              <strong>KHOOR ZRUOG</strong>
            </div>
          </div>

          <div className="floating-number number-one">26</div>
          <div className="floating-number number-two">🔐</div>
        </div>
      </section>

      {/* ACADEMY CREDENTIAL STATUS BANNER */}
      <section
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--r-xl)",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: certEval.isEligible ? "#166534" : "#d97706",
              }}
            >
              {certEval.isEligible ? "🏆 OFFICIAL ACCREDITATION UNLOCKED" : "🔒 ACADEMY CERTIFICATE OF COMPLETION"}
            </span>
            <h3 style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800 }}>
              {certEval.isEligible
                ? "Certificate of Completion Unlocked (500/500 PTS)"
                : "Demonstrate Brute Force and Frequency Analysis"}
            </h3>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              onClick={() => setActivePage("Certificate")}
            >
              👁 Preview / View Certificate
            </button>
            <button
              type="button"
              className="practice-action-btn btn-start"
              onClick={() => setActivePage("Practice Lab")}
            >
              ▶ Solve Practice Labs
            </button>
          </div>
        </div>

        {/* 4 Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <div style={{ background: "var(--bg)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block" }}>
              LABS COMPLETED
            </span>
            <strong style={{ fontSize: "1.15rem", color: "var(--text-primary)" }}>
              {certEval.completedLabsCount} / {certEval.totalLabsCount}
            </strong>
          </div>
          <div style={{ background: "var(--bg)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block" }}>
              TOTAL VERIFIED SCORE
            </span>
            <strong style={{ fontSize: "1.15rem", color: "var(--text-primary)" }}>
              {certEval.totalVerifiedScore} / 500
            </strong>
          </div>
          <div style={{ background: "var(--bg)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block" }}>
              TASKS RESOLVED
            </span>
            <strong style={{ fontSize: "1.15rem", color: "var(--text-primary)" }}>
              {certEval.totalTasksCompleted} / {certEval.totalTasksRequired}
            </strong>
          </div>
          <div style={{ background: "var(--bg)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block" }}>
              CREDENTIAL STATUS
            </span>
            <strong style={{ fontSize: "1.15rem", color: certEval.isEligible ? "#166534" : "#92400e" }}>
              {certEval.isEligible ? "Certificate Unlocked" : "Pending Requirements"}
            </strong>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-grid">
        <Stat number="02" label="Attack Techniques" icon="⚔️" />
        <Stat number="26" label="Alphabet Size" icon="🔤" />
        <Stat number="05" label="Guided Laboratories" icon="🧪" />
        <Stat number="100%" label="Interactive" icon="⚡" />
      </section>

      {/* MODULES */}
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="section-label">LEARNING MODULES</p>
            <h2>Explore the Lab</h2>
          </div>

          <span className="module-count">4 Modules</span>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <div className="module-card" key={module.title}>
              <div className="module-icon">{module.icon}</div>

              <h3>{module.title}</h3>

              <p>{module.description}</p>

              <button onClick={() => setActivePage(module.page)}>
                Open Module →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CONCEPT */}
      <section className="concept-card">
        <div className="concept-icon">💡</div>

        <div>
          <span>CORE CONCEPT</span>

          <h3>What is Monoalphabetic Cryptanalysis?</h3>

          <p>
            A monoalphabetic substitution cipher replaces every plaintext
            letter with another fixed letter. Cryptanalysis attempts to
            recover the original message without knowing the secret key.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <strong>{number}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default App;