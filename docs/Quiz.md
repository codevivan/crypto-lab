# Assessment & Quiz System Documentation

---

## 1. Overview & Purpose
CryptoBreak Lab includes a built-in, interactive assessment system designed to evaluate student comprehension of classical cryptography, modular mathematics, and cryptanalytic vulnerabilities.

The primary assessment feature is an in-website, formative evaluation quiz integrated into the **Learn** educational module. It allows students to test their understanding after reviewing theoretical concepts and performing practical simulation experiments.

> [!NOTE]
> This document details the implementation, architecture, and access workflow of the quiz system as verified in the application source code. As per laboratory guidelines, the specific quiz questions are not duplicated here and must be accessed directly through the interactive web interface.

---

## 2. Accessing the In-Website Assessment Quiz

To access the assessment quiz within the running application:

1. Open the CryptoBreak Lab application in your web browser (`http://localhost:5173/` or `http://localhost:8080/`).
2. In the left sidebar navigation menu, locate the **LEARN** section and click on **Concepts** (📚).
3. At the top of the Learn workspace, locate the view mode selector containing two options:
   - **Concepts View** (Core theoretical cheatsheets)
   - **Assessment Quiz View** (Interactive assessment)
4. Click the **Assessment Quiz** button to transition into the quiz examination interface.

---

## 3. Quiz Architecture & Implementation Details

The assessment feature is implemented through the following components and data structures:

| Component / File | Role in Assessment Workflow |
| :--- | :--- |
| [`src/components/ConceptQuiz.jsx`](file:///c:/Users/vivan%20shetty/Desktop/cryptobreak-lab/src/components/ConceptQuiz.jsx) | Interactive quiz user interface component handling question rendering, option selection, submission handling, immediate visual feedback, score calculation, and final results reporting. |
| [`src/modules/Learn.jsx`](file:///c:/Users/vivan%20shetty/Desktop/cryptobreak-lab/src/modules/Learn.jsx) | Module controller maintaining persistent quiz state (current question index, selected answers, submitted answers, earned scores, and results toggle) across navigation within the Learn module. |
| [`src/data/concepts.js`](file:///c:/Users/vivan%20shetty/Desktop/cryptobreak-lab/src/data/concepts.js) | Data file defining the `CONCEPTS_QUIZ` array containing 10 rigorous, university-level multiple-choice questions with answer choices, correct index pointers, and comprehensive educational explanations. |

---

## 4. Assessment Workflow & Interaction Rules

The quiz operates according to the following verified workflow:

### 4.1 Question Navigation
- The top of the quiz interface displays a **Question Number Strip** containing 10 clickable buttons (numbered 1 through 10).
- Students can navigate sequentially using **Previous** / **Next** controls or jump directly to any question by clicking its number button.
- Answered questions display a completion status indicator in the navigation strip.

### 4.2 Answering & Immediate Feedback
- For each question, four multiple-choice options (labeled A, B, C, D) are presented.
- The student selects an option and clicks **Submit Answer**.
- The system immediately evaluates the response against the verified answer key:
  - **Correct Submission**: Highlighted with a green success border, earning 1 point toward the total score.
  - **Incorrect Submission**: Highlighted with an error indicator, earning 0 points while displaying the correct answer.
- **Pedagogical Explanation**: An explanation panel automatically appears below the question, articulating the underlying mathematical or cryptanalytic rationale.

### 4.3 Results & Performance Evaluation
- Upon completing all 10 questions, the student can view the **Comprehensive Quiz Results**:
  - **Final Score**: Expressed as points earned out of 10 (e.g., $9/10$) and as an overall percentage.
  - **Performance Evaluation Badge**:
    - **Mastery Achieved** ($\ge 80\%$)
    - **Competent Understanding** ($60\% - 79\%$)
    - **Review Recommended** ($< 60\%$)
  - **Detailed Itemized Review**: Allows the student to review each question, their submitted response, and the corresponding cryptanalysis takeaway.
- **Formative Retake Capability**: A **Retake Quiz** button resets the active session state, allowing the student to re-attempt the quiz for formative mastery.

---

## 5. Topics Evaluated by the Assessment

The 10 in-website assessment questions cover the following core syllabus areas:
1. **Kerckhoffs's Principle**: Security dependence on key secrecy rather than algorithmic obscurity.
2. **Caesar Cipher Keyspace**: Mathematical basis for the 26-shift boundary.
3. **Brute-Force Feasibility**: Computational comparison between 26 shifts and $26!$ permutations.
4. **Frequency Analysis Principles**: Invariance of letter probabilities under monoalphabetic substitution.
5. **English Language Distributions**: Identifying high-frequency unigrams (`ETAOIN`).
6. **N-Gram Analysis**: Utilizing digrams (`TH`) and trigrams (`THE`) to resolve substitution ambiguities.
7. **Affine Cipher Mathematical Constraints**: Coprimality requirement $\gcd(a, 26) = 1$ and valid key selection.
8. **Product Cipher Cryptanalysis**: Linearity vulnerabilities of cascading substitution layers.
9. **Diffusion Weakness**: Demonstrating why monoalphabetic substitution provides zero diffusion.
10. **Modern Cryptographic Countermeasures**: How modern block ciphers (AES) resist classical frequency attacks.

---

## 6. Formative Debrief Questions in Practice Labs

In addition to the standalone Assessment Quiz, the **Practice Lab** module ([`src/modules/PracticeLab.jsx`](file:///c:/Users/vivan%20shetty/Desktop/cryptobreak-lab/src/modules/PracticeLab.jsx)) embeds scenario-specific debrief questions within each of the 5 guided laboratories:
- Students answer conceptual and analytical questions regarding keyspace constraints, statistical anomalies, and attack selection as part of the 32 tasks required to earn the 500-point Certificate of Completion.
