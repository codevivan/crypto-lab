import { useState, useEffect } from "react";
import "./index.css";
import CipherSimulator from "./modules/CipherSimulator";
import BruteForce from "./modules/BruteForce";
import FrequencyAnalysis from "./modules/FrequencyAnalysis";
import PracticeLab from "./modules/PracticeLab";
import Learn from "./modules/Learn";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cryptobreak-theme") || "light";
    } catch {
      return "light";
    }
  });

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
        "Solve cryptanalysis challenges and test your understanding.",
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
          <Dashboard modules={modules} setActivePage={setActivePage} />
        ) : activePage === "Cipher Simulator" ? (
          <CipherSimulator />
        ) : activePage === "Brute Force" ? (
          <BruteForce />
        ) : activePage === "Frequency Analysis" ? (
          <FrequencyAnalysis />
        ) : activePage === "Practice Lab" ? (
          <PracticeLab />
        ) : activePage === "Learn" ? (
          <Learn />
        ) : null}
      </main>
    </div>
  );
}

function Dashboard({ modules, setActivePage }) {
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

          <button
            className="primary-button"
            onClick={() => setActivePage("Cipher Simulator")}
          >
            Start Experiment →
          </button>
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

      {/* STATS */}
      <section className="stats-grid">
        <Stat number="02" label="Attack Techniques" icon="⚔️" />
        <Stat number="26" label="Alphabet Size" icon="🔤" />
        <Stat number="06" label="Lab Experiments" icon="🧪" />
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

          <h3>
            What is Monoalphabetic Cryptanalysis?
          </h3>

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