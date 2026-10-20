# Learning Objectives: Monoalphabetic Cipher Cryptanalysis

---

## 1. Overview
The learning objectives for this laboratory experiment are structured in accordance with **Bloom's Revised Taxonomy of Educational Objectives**, progressing from foundational cognitive knowledge to practical analysis and evaluation.

---

## 2. Measurable Learning Objectives

Upon successful completion of the experiments in CryptoBreak Lab, students will be able to:

### Objective 1: Understand Classical Cryptographic Principles (Cognitive — Knowledge & Comprehension)
- **1.1**: Define the formal components of a symmetric cryptosystem: plaintext space $\mathcal{M}$, ciphertext space $\mathcal{C}$, key space $\mathcal{K}$, encryption function $E_K(P)$, and decryption function $D_K(C)$.
- **1.2**: Distinguish between transposition ciphers and substitution ciphers, and characterize the mathematical properties of monoalphabetic mapping.
- **1.3**: Explain the modular arithmetic formulation of the Caesar shift cipher ($C \equiv P + K \pmod{26}$) and the Affine cipher ($C \equiv aP + b \pmod{26}$ with $\gcd(a, 26) = 1$).
- **1.4**: Calculate the exact cardinality of key spaces for the Caesar cipher ($|\mathcal{K}| = 26$), Affine cipher ($|\mathcal{K}| = 312$), and general monoalphabetic substitution ($|\mathcal{K}| = 26! \approx 4.03 \times 10^{26}$).

### Objective 2: Execute & Evaluate Brute-Force Attacks (Practical — Application & Analysis)
- **2.1**: Implement and observe an automated exhaustive key search across the 26 possible shift values of a Caesar cipher.
- **2.2**: Measure and compare candidate plaintexts generated during brute-force iterations to identify the correct encryption key $K$.
- **2.3**: Contrast the computational tractability of exhaustive search on Caesar and Affine ciphers against the computational intractability of brute-forcing a 26! permutation key space.
- **2.4**: Explain why a large key space alone does not ensure cryptographic security if the cipher design fails to provide statistical diffusion.

### Objective 3: Conduct Statistical Frequency Analysis (Practical — Application & Analysis)
- **3.1**: Compute and plot the unigram frequency distribution of letters from an intercepted monoalphabetic ciphertext.
- **3.2**: Compare observed ciphertext letter frequencies against standard reference distributions of natural English text (`ETAOIN`).
- **3.3**: Extract and analyze high-frequency digrams (e.g., `TH`, `HE`, `IN`) and trigrams (e.g., `THE`, `AND`) to resolve single-letter ambiguities.
- **3.4**: Formulate substitution hypotheses systematically, map ciphertext characters to candidate plaintext characters, and verify partial decryptions interactively.
- **3.5**: Identify operational conditions where frequency analysis encounters limitations (e.g., short ciphertexts, specialized vocabularies).

### Objective 4: Apply Cryptanalysis in Case-Study Scenarios (Practical — Synthesis)
- **4.1**: Complete multi-step cryptanalysis challenges in the Practice Lab across 5 distinct scenario-based case studies:
  1. *Caesar Cipher Investigation: Historical Message Interception*
  2. *Affine Cipher Workshop: Incorrectly Configured Encryption*
  3. *Product Cipher Laboratory: Transformation Pipeline Failure*
  4. *Substitution & Frequency Analysis: Investigating a Leaked Message*
  5. *Cryptanalysis Mission: Choosing the Optimal Attack*
- **4.2**: Verify candidate keys and recovered plaintexts using deterministic algorithmic feedback.
- **4.3**: Achieve a verified mastery score of $500/500$ points across 32 structured laboratory tasks.

### Objective 5: Evaluate Cryptographic Design & Modern Countermeasures (Evaluation)
- **5.1**: Evaluate the role of Claude Shannon's principles of **confusion** and **diffusion** in cipher design, demonstrating that monoalphabetic ciphers lack diffusion.
- **5.2**: Apply **Kerckhoffs's Principle** to analyze why relying on algorithm obscurity or small keys creates immediate systemic vulnerability.
- **5.3**: Explain how modern symmetric ciphers (e.g., AES) overcome classical monoalphabetic vulnerabilities through iterative Substitution-Permutation Networks (SPNs).
