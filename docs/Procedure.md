# Laboratory Procedure: Step-by-Step Instructions

---

## 1. Accessing the Virtual Laboratory

1. **Launch the Application**:
   - Open your web browser and navigate to the application URL:
     - Local development server: `http://localhost:5173/`
     - Production Docker container: `http://localhost:8080/`
2. **Examine the Interface Layout**:
   - **Left Sidebar**: Contains the primary navigation menu:
     - `Dashboard` (▦)
     - `Cipher Simulator` (🔐)
     - `Brute Force` (💥)
     - `Frequency Analysis` (📊)
     - `Practice Lab` (🧪)
     - `Certificate` (📜)
     - `Concepts` under LEARN (📚)
     - `Feedback` under FEEDBACK (💬)
   - **Top Bar**: Shows breadcrumb navigation, current active module heading, and a **Light/Dark Theme Toggle button** (☀️/🌙).
3. **Select Your Theme**:
   - Click the theme toggle button in the top bar to choose between **Light** and **Dark** modes based on your viewing preference.

---

## 2. Phase 1: Exploring Cipher Simulation (`Cipher Simulator`)

1. Click **Cipher Simulator** in the sidebar navigation.
2. **Select a Cipher Mode** from the selector bar:
   - **Caesar Cipher**:
     - Adjust the **Caesar Shift Key ($K$)** slider or use the `−` and `+` decrement/increment buttons to select any shift value from $0$ to $25$.
     - Observe the formula update: $C \equiv (P + K) \pmod{26}$.
   - **Affine Cipher**:
     - Select a valid multiplicative key $a$ from the dropdown: $\{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25\}$.
     - Adjust the additive shift key $b$ ($0$ to $25$).
     - Observe the coprime validity indicator and formula: $C \equiv (a \cdot P + b) \pmod{26}$.
   - **Product Cipher**:
     - Configure the two-stage encryption pipeline: Layer 1 (Caesar shift $K$) followed by Layer 2 (Affine transformation $aP + b$).
   - **Substitution Cipher**:
     - Inspect the 26-letter substitution alphabet key.
     - Click **Randomize Key** to generate a random valid permutation, or manually enter custom alphabet mappings.
     - The validation indicator will verify that all 26 unique characters are present without duplicate letters.
3. **Enter Plaintext**:
   - Type custom text into the **Plaintext Message** textarea, or click **Load Sample** to populate a standard pangram message.
4. **Inspect the Outputs**:
   - View the generated **Ciphertext Output** box.
   - Click **Copy** to copy the ciphertext to the clipboard.
   - Scroll down to the **Key Mapping Matrix** to observe the exact character-by-character mapping from the plaintext alphabet to the ciphertext alphabet.

---

## 3. Phase 2: Executing a Brute-Force Attack (`Brute Force`)

1. Click **Brute Force** in the sidebar navigation.
2. **Provide Target Ciphertext**:
   - By default, the input contains a sample Caesar ciphertext: `KHOOR ZRUOG`.
   - Alternatively, paste any unknown Caesar ciphertext into the **Ciphertext to Attack** textarea.
3. **Configure Attack Speed**:
   - In the **Attack Controls** panel, select an animation speed:
     - **Fast** (40 ms per shift)
     - **Normal** (150 ms per shift)
     - **Step-by-Step** (450 ms per shift, ideal for visual tracking)
4. **Execute the Attack**:
   - Click **Start Attack**.
   - Observe the live simulation stepping through all shift keys from $K = 0$ to $K = 25$.
   - Note the **Current Shift** badge and the live candidate output updating in real time.
   - Click **Pause** to freeze execution at any point, and **Resume** to continue.
5. **Analyze the Results**:
   - Review the generated **All 26 Possible Plaintexts** results table.
   - Locate the row where the candidate text forms recognizable English words. For the default sample, Shift $K = 3$ yields `HELLO WORLD`.
   - Click on any row in the table to inspect that candidate and its corresponding shift key.
6. **Reset the Simulation**:
   - Click **Reset** to clear all attempts and restore the simulation to its idle state.

---

## 4. Phase 3: Conducting Statistical Frequency Analysis (`Frequency Analysis`)

1. Click **Frequency Analysis** in the sidebar navigation.
2. **Review Target Ciphertext**:
   - The workspace loads with an initial monoalphabetic substitution ciphertext generated via a random 26-letter permutation key.
   - You may also paste custom monoalphabetic ciphertext into the input area.
3. **Inspect Statistical Distributions**:
   - Observe the statistical metrics: **Total Letters** and **Unique Letters**.
   - Examine the **Letter Frequency Distribution Chart**:
     - Blue bars represent the observed frequency of each ciphertext letter.
     - Gray reference lines indicate standard expected English frequencies (`ETAOIN...`).
   - Examine the **Frequency Table** showing exact letter counts and percentages sorted in descending order.
4. **Examine N-Grams**:
   - Review the **Common Digrams** (2-letter pairs) and **Common Trigrams** (3-letter patterns) extracted from the ciphertext.
   - Compare top ciphertext digrams and trigrams against high-probability English patterns (`TH`, `HE`, `IN`, `THE`, `AND`).
5. **Perform Substitution Mapping**:
   - Scroll to the **Interactive Letter Mapping Panel**.
   - Match high-frequency ciphertext letters to suspected plaintext letters by selecting candidate characters from the dropdown for each cipher letter.
   - **Quick Hypothesis Feature**: Click **Auto-Apply Top Hypotheses** to automatically map the 6 most frequent ciphertext letters to the top English letters: `E`, `T`, `A`, `O`, `I`, `N`.
6. **Inspect Reconstructed Plaintext**:
   - Watch the **Decrypted Plaintext Candidate** preview in the right panel.
   - Mapped letters appear as regular characters; unmapped letters are represented by bullet dots (`•`).
   - Use linguistic context and vocabulary deduction to identify words and iteratively adjust mappings until the entire message is recovered.
7. **Reset**:
   - Click **Reset Mappings** to clear all active substitution hypotheses and restart the analysis.

---

## 5. Phase 4: Solving Practical Laboratory Challenges (`Practice Lab`)

1. Click **Practice Lab** in the sidebar navigation.
2. **Select a Laboratory Case Study**:
   - Lab 01: *Caesar Cipher Investigation: Historical Message Interception*
   - Lab 02: *Affine Cipher Workshop: Incorrectly Configured Encryption*
   - Lab 03: *Product Cipher Laboratory: Transformation Pipeline Failure*
   - Lab 04: *Substitution & Frequency Analysis: Investigating a Leaked Message*
   - Lab 05: *Cryptanalysis Mission: Choose the Right Attack*
3. **Read Guidelines & Objectives**:
   - Review the mission brief, objectives, "What you will do", and "What you need to know" sections.
4. **Complete Interactive Tasks**:
   - Solve tasks sequentially or in any order across the 6–7 tasks per lab (32 tasks total across all 5 labs).
   - Use the built-in task controls (text inputs, shift sliders, dropdown selectors, scratchpads, and multiple-choice answers).
   - Click **Submit Task** to verify your answer.
   - If stuck, click **Request Hint** (note: each hint used deducts 5 points from the task's maximum available score).
   - If points were lost due to hints, click **Reset Task** to wipe hints and re-attempt for the full score.
5. **Collect Achievements**:
   - Earn milestone commendation badges (e.g., *First Breakthrough*, *Caesar Sleuth*, *Master Cryptanalyst*) as milestones are met.
6. **Achieve Credential Eligibility**:
   - Complete all 32 tasks across all 5 laboratories with a verified score of **500/500 PTS**.

---

## 6. Phase 5: Generating the Certificate of Completion (`Certificate`)

1. Click **Certificate** in the sidebar navigation.
2. **Review Credential Status**:
   - Check the live requirements dashboard (Labs Completed, Verified Score, Tasks Resolved).
3. **Preview & Download**:
   - Click **Preview Certificate** to inspect the official vectorized SVG credential featuring your student name, stable credential ID (`CBL-2026-XXXX-500M`), date, and competencies.
   - Once all 500/500 points are achieved, click **Download Official PDF** to generate an authentic client-side vector PDF document via `jspdf`.

---

## 7. Phase 6: Assessment Quiz & Feedback

1. **Complete the Assessment Quiz**:
   - Click **Concepts** under LEARN in the sidebar.
   - Click the **Assessment Quiz** view button.
   - Complete all 10 university-level multiple-choice questions.
   - Submit answers to view immediate scoring, rationales, and review recommendations.
2. **Submit Laboratory Feedback**:
   - Click **Feedback** in the sidebar navigation.
   - Provide an overall star rating (1–5 stars).
   - Select the feedback category from the dropdown menu.
   - Enter qualitative feedback (10–1000 characters) with live character counter validation.
   - Select optional improvement areas and optionally provide an email address.
   - Click **Submit Feedback** to record your entry locally in browser storage (`cryptobreak-feedback`).
