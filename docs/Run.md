# Running and Testing CryptoBreak Lab

This document outlines the commands, procedures, and verified test results for running, building, and validating the **CryptoBreak Lab** application.

---

## 1. Commands Summary

| Task | Command | Description | Verified Status |
| :--- | :--- | :--- | :---: |
| **Run Development Server** | `npm run dev` | Starts the Vite development server at `http://localhost:5173/` with Hot Module Replacement (HMR). | ✓ Verified |
| **Production Build** | `npm run build` | Compiles and optimizes the React application for production, generating distribution assets in the `dist/` directory. | ✓ Verified (Exit 0) |
| **Preview Production Build** | `npm run preview` | Starts a local HTTP server to preview the compiled production build from `dist/`. | ✓ Verified |
| **Check Code Quality** | `npm run lint` | Runs ESLint across the codebase to identify code-quality issues, syntax errors, and style violations. | ✓ Verified (0 Errors, 0 Warnings) |
| **Run Lab Tests** | `node test-certificate.js` | Runs the certificate evaluation and scoring test suite, containing **76 tests**. | ✓ Verified (76 Passed, 0 Failed) |
| **Run Feedback Tests** | `node test-feedback.js` | Runs the feedback system and local storage test suite, containing **48 tests**. | ✓ Verified (48 Passed, 0 Failed) |

---

## 2. Prerequisites

| Prerequisite | Minimum Required Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v20.x` or `v22.x` (LTS) | JavaScript runtime engine for local development and testing. |
| **npm** | `v10.x` or higher | Package manager for managing dependencies and running lifecycle scripts. |
| **Web Browser** | Chrome, Edge, Firefox, Brave, Safari | User interface for interacting with the laboratory. |
| **Docker** *(Optional)* | Docker Desktop / Docker Engine | Containerized runtime for production Nginx serving. |

---

## 3. Execution Procedure

| Step | Action | Command | Expected Output |
| :---: | :--- | :--- | :--- |
| **1** | Open Terminal | Open a terminal in the project root: `c:\Users\vivan shetty\Desktop\cryptobreak-lab` | Terminal prompt in project root. |
| **2** | Install Dependencies | `npm install` | All packages installed into `node_modules/` without error. |
| **3** | Start Development Server | `npm run dev` | `VITE v8.3.1 ready in ~300 ms` at `http://localhost:5173/`. |
| **4** | Access Laboratory | Open browser to `http://localhost:5173/` | Interactive CryptoBreak Lab UI loads with all modules accessible. |
| **5** | Code Quality Check | `npm run lint` | Exits cleanly with code `0` (no errors or warnings). |
| **6** | Production Build | `npm run build` | Bundles 244 modules into `dist/` within ~400 ms. |
| **7** | Execute Lab Tests | `node test-certificate.js` | **76 passed, 0 failed** across 4 test suites. |
| **8** | Execute Feedback Tests | `node test-feedback.js` | **48 passed, 0 failed** across 3 test suites. |

---

## 4. Verified Test Results

### Suite A: Certificate & Scoring Tests (`node test-certificate.js`)

| Test Suite | Description | Tests Passed | Status |
| :--- | :--- | :---: | :---: |
| **Suite 1: Lab Data & Task Counts** | Verifies 5 labs, 32 total tasks, and 500 total points ($100$ pts per lab). | 13 | ✓ Passed |
| **Suite 2: Incomplete State Evaluation** | Verifies scoring thresholds, partial completions ($0/5$, $1/5$, $4/5$, $31/32$ tasks), and ineligibility handling. | 43 | ✓ Passed |
| **Suite 3: 100% Mastery State Evaluation** | Verifies full eligibility unlocking when all 32 tasks and 500/500 points are achieved. | 18 | ✓ Passed |
| **Suite 4: Credential ID Stability** | Verifies stable generation and formatting of credential ID (`CBL-2026-*`). | 2 | ✓ Passed |
| **Total** | | **76 / 76** | **100% Pass** |

### Suite B: Feedback & Storage Tests (`node test-feedback.js`)

| Test Suite | Description | Tests Passed | Status |
| :--- | :--- | :---: | :---: |
| **Suite 1: Configuration & Options** | Verifies storage key (`cryptobreak-feedback`), 5 rating levels, 13 categories, and 10 improvement areas. | 30 | ✓ Passed |
| **Suite 2: Unique ID Generation** | Verifies `fb_` prefix, uniqueness across calls, and alphanumeric entropy. | 2 | ✓ Passed |
| **Suite 3: Local Storage Behavior** | Verifies structured saving, ISO timestamps, multi-entry appending, and recovery from corrupted/malformed storage. | 16 | ✓ Passed |
| **Total** | | **48 / 48** | **100% Pass** |

---

## 5. Production Docker Execution *(Alternative)*

| Operation | Command | Description |
| :--- | :--- | :--- |
| **Build Docker Image** | `docker build -t cryptobreak-lab:latest .` | Compiles application using Node.js multi-stage build and bundles into Nginx Alpine image. |
| **Run Container** | `docker run -d --name cryptobreak-lab -p 8080:80 cryptobreak-lab:latest` | Runs container in detached mode mapping host port `8080` to container port `80`. |
| **Access Container** | Open `http://localhost:8080/` | Serves production-optimized static assets via Nginx with SPA routing. |
| **Check Logs** | `docker logs cryptobreak-lab` | Displays Nginx access and startup logs. |
| **Stop & Remove** | `docker stop cryptobreak-lab && docker rm cryptobreak-lab` | Gracefully stops worker processes and cleans up container. |
