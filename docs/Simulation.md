# Simulation Workflow & Technical Implementation Guide

---

## 1. Simulation Architecture Overview

CryptoBreak Lab is implemented as a **100% client-side, deterministic simulation engine** built using React 19 and Vite 8, containerized for production using Nginx on Alpine Linux.

All cryptographic computations, frequency distributions, attack loops, and grading evaluations are executed directly within the client's web browser JavaScript runtime environment. The application makes no external API requests, requires no backend database, and operates as an isolated virtual laboratory sandbox.

```
+-----------------------------------------------------------------------+
|                         CryptoBreak Lab Client                        |
+-----------------------------------------------------------------------+
|  React 19 Application State (App.jsx, Navigation, Theme, Storage)     |
+-----------------------------------------------------------------------+
|     Simulation Engines                                                |
|     - Cipher Simulator (caesar.js, affine.js, product.js, subst.js)   |
|     - Brute-Force Attack Engine (timer-based keyspace search loop)   |
|     - Statistical Frequency Analyzer (analysis.js, unigram/n-grams)   |
|     - Practice Lab Evaluation Engine (labs.js, scoring, hints)        |
+-----------------------------------------------------------------------+
|  Browser Local Storage API (cryptobreak-practice-progress, feedback)  |
+-----------------------------------------------------------------------+
```

---

## 2. Implemented Simulation Workflows

### 2.1 Cipher Simulator Workflow
- **Component**: [`src/modules/CipherSimulator.jsx`](file:///c:/Users/vivan%20shetty/Desktop/cryptobreak-lab/src/modules/CipherSimulator.jsx)
- **Input Parameters**:
  - `plaintext`: Raw string entered by the user.
  - `mode`: Selected cipher paradigm (`"caesar"` | `"affine"` | `"product"` | `"substitution"`).
  - Mode parameters:
    - Caesar: Shift key $K \in [0, 25]$.
    - Affine: Multiplicative key $a \in \{1, 3, \dots, 25\}$ and additive key $b \in [0, 25]$.
    - Product: Layer 1 shift $K$, Layer 2 affine pair $(a, b)$.
    - Substitution: 26-character permutation key string.
- **Transformation Pipeline**:
  - Letters are normalized to uppercase for mathematical transformation; non-alphabetic characters (spaces, punctuation, numerals) are preserved unchanged.
  - Caesar: $c_i = (p_i + K) \pmod{26}$.
  - Affine: $c_i = (a \cdot p_i + b) \pmod{26}$.
  - Product: Intermediate $t_i = (p_i + K) \pmod{26}$, followed by $c_i = (a \cdot t_i + b) \pmod{26}$.
  - Substitution: Direct index lookup in the permutation key string.
- **Outputs & Observations**:
  - Real-time ciphertext stream display.
  - Character and letter counters.
  - Dynamic **Key Mapping Grid** showing one-to-one letter correspondence.

---

### 2.2 Brute-Force Attack Simulation Workflow
- **Component**: [`src/modules/BruteForce.jsx`](file:///c:/Users/vivan%20shetty/Desktop/cryptobreak-lab/src/modules/BruteForce.jsx)
- **Input Parameters**:
  - `ciphertext`: Target encrypted string.
  - `speed`: Timer delay per iteration (`"fast"`: 40 ms, `"normal"`: 150 ms, `"step"`: 450 ms).
- **Attack Engine State Machine**:
  ```
  [ IDLE ] --(Start Attack)--> [ RUNNING ] <--(Resume)--+
                                   |                    |
                                (Timer Tick)         (Pause)
                                   v                    |
                           Shift K: 0 -> 25             |
                           Candidate Generated          |
                                   |                    |
                                   +---------------->[ PAUSED ]
                                   |
                          (K reaches 25)
                                   v
                             [ COMPLETED ]
  ```
- **Execution Loop**:
  - On each tick of the timer, the attack engine sets current shift $K \in [0, 25]$.
  - Invokes `caesarDecrypt(ciphertext, K)` to generate candidate plaintext $P^{(K)}$.
  - Appends attempt record `{ attemptNum, shift, candidate, status: "Tested" }` to the attempts table.
  - If the candidate matches known target plaintext, it is visually highlighted.
- **Outputs & Observations**:
  - Animated shift indicator badge showing current tested key.
  - Complete 26-row candidate plaintext table.
  - Interactive row selection to inspect specific shift parameters.

---

### 2.3 Frequency Analysis Simulation Workflow
- **Component**: [`src/modules/FrequencyAnalysis.jsx`](file:///c:/Users/vivan%20shetty/Desktop/cryptobreak-lab/src/modules/FrequencyAnalysis.jsx)
- **Input Parameters**:
  - `ciphertext`: Target monoalphabetic substitution string.
  - `mapping`: User-defined hypothesis dictionary `{ [cipherChar]: plainChar }`.
- **Statistical Processing**:
  - `countLetterFrequency(ciphertext)`: Computes counts and percentage frequencies for letters $A$ through $Z$.
  - `getSortedNGrams(ciphertext, n, limit)`: Extracts and sorts top bigrams ($n=2$) and trigrams ($n=3$).
  - Compares computed frequencies against standard English reference values:
    $$\text{Expected: } E (12.7\%), T (9.1\%), A (8.2\%), O (7.5\%), I (7.0\%), N (6.7\%)$$
- **Reconstruction Algorithm**:
  - For each character in the ciphertext, if a hypothesis mapping exists in `mapping`, the mapped plaintext letter is rendered; if unmapped, a placeholder bullet dot (`•`) is rendered.
- **Outputs & Observations**:
  - Dual-series bar chart comparing observed vs expected distributions.
  - Ranked frequency table with exact percentage values.
  - Extracted N-gram list highlighting common structural patterns (`TH`, `THE`).
  - Interactive hypothesis mapping panel with one-click top-hypothesis assignment.
  - Partially decrypted live plaintext candidate preview.

---

## 3. How a Learner Interprets Results

1. **Interpreting Brute-Force Output**:
   - The learner reviews the 26 generated candidates.
   - Because English has an average entropy of approximately 1.5 bits per character (Shannon redundancy), 25 of the 26 candidates will appear as unintelligible character strings (e.g., `ZHOOR ZRUOG`, `YGNNO YQTNF`).
   - The solitary candidate that produces valid English vocabulary (`HELLO WORLD`) unambiguously reveals the secret shift key ($K = 3$).
2. **Interpreting Frequency Analysis Output**:
   - The learner observes which ciphertext letter has the highest peak in the bar chart. In English texts of sufficient length, this letter almost always corresponds to `E` or `T`.
   - By cross-referencing high-frequency ciphertext letters with top bigrams and trigrams, the learner confirms hypotheses. For example, if ciphertext characters `X` and `Y` frequently appear as the digram `XY`, and `X` is hypothesized as `T`, then `Y` is likely `H`.
   - The gradual substitution of letters eliminates bullet placeholders (`•`), allowing morphological recognition of words (e.g., `TH•S •S A S•MPL• M•SS•G•` $\rightarrow$ `THIS IS A SAMPLE MESSAGE`).

---

## 4. Distinguishing Real Functionality vs. Conceptual Simulation

To maintain technical integrity, the following table clarifies the boundary between real code execution and pedagogical simulation:

| Feature | Classification | Technical Reality |
| :--- | :--- | :--- |
| **Mathematical Transformations** | **Real Functionality** | Genuine modular arithmetic implemented in JavaScript (`caesar.js`, `affine.js`, `substitution.js`). |
| **Frequency & N-Gram Counting** | **Real Functionality** | Computes real mathematical statistics and percentages from user-entered text. |
| **Brute-Force Attack Execution** | **Real Functionality** | Actually iterates and decrypts across all 26 keys. |
| **Brute-Force Animation Speed** | **Pedagogical Throttle** | The delay (40ms–450ms) is an artificial `setTimeout` throttle so human students can visually follow the traversal. Real computers test 26 keys in $< 1$ microsecond. |
| **Operational Scope** | **Client-Side Simulation** | Operates strictly within the user's browser sandbox on user-entered text strings. Does **not** perform network attacks, packet sniffing, or attacks on remote systems. |
| **Docker Role** | **Static Asset Serving** | Docker containerizes Nginx to serve static React/Vite assets over HTTP. It does **not** provide network penetration testing or containerized backend services. |
| **Progress Persistence** | **Real Client Storage** | Uses browser `localStorage` API. Does **not** communicate with a central cloud database or instructor server. |
