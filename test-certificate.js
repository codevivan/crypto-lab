/* global process */
import { LABS } from "./src/data/labs.js";
import {
  evaluateCertificateEligibility,
  getOrCreateCredentialId,
} from "./src/utils/certificatePdf.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✕ FAIL: ${message}`);
    failed++;
  }
}

console.log("=== TEST SUITE 1: LAB DATA AND TASK COUNTS ===");
assert(LABS.length === 5, "Exactly 5 laboratories defined");
const expectedTaskCounts = [6, 6, 6, 7, 7];
let totalTasksInLabs = 0;
let totalPointsInLabs = 0;

LABS.forEach((lab, idx) => {
  assert(
    lab.tasks.length === expectedTaskCounts[idx],
    `Lab ${lab.number} (${lab.title.slice(0, 25)}...) has exactly ${expectedTaskCounts[idx]} tasks`
  );
  const labPts = lab.tasks.reduce((sum, t) => sum + t.points, 0);
  assert(labPts === 100, `Lab ${lab.number} points total 100 PTS`);
  totalTasksInLabs += lab.tasks.length;
  totalPointsInLabs += labPts;
});

assert(totalTasksInLabs === 32, `Total tasks across all 5 labs is exactly 32 (got ${totalTasksInLabs})`);
assert(totalPointsInLabs === 500, `Total points across all 5 labs is exactly 500 (got ${totalPointsInLabs})`);

console.log("\n=== TEST SUITE 2: INCOMPLETE STATE EVALUATION ===");
// Case A: Fresh initial state (0 tasks done)
const emptyState = {};
LABS.forEach((lab) => {
  emptyState[lab.id] = {};
  lab.tasks.forEach((t) => {
    emptyState[lab.id][t.id] = { completed: false, pointsEarned: 0 };
  });
});

const evalFresh = evaluateCertificateEligibility(LABS, emptyState);
assert(evalFresh.isEligible === false, "Fresh state is not eligible");
assert(evalFresh.completedLabsCount === 0, "Fresh state has 0/5 completed labs");
assert(evalFresh.totalTasksCompleted === 0, "Fresh state has 0/32 tasks completed");
assert(evalFresh.totalVerifiedScore === 0, "Fresh state has 0/500 verified score");
assert(evalFresh.totalTasksRequired === 32, "Fresh state reports 32 required tasks");

// Check each lab in evalFresh
evalFresh.labDetails.forEach((ld) => {
  assert(ld.score === 0, `Lab ${ld.labNumber} initial score is 0`);
  assert(ld.tasksCompleted === 0, `Lab ${ld.labNumber} initial tasksCompleted is 0`);
  assert(ld.remainingPoints === 100, `Lab ${ld.labNumber} initial remainingPoints is 100`);
  assert(ld.isComplete === false, `Lab ${ld.labNumber} isComplete is false`);
});

// Case B: Partial completion (Lab 1 completed 100/100, others 0)
const partialState1 = JSON.parse(JSON.stringify(emptyState));
LABS[0].tasks.forEach((t) => {
  partialState1[1][t.id] = { completed: true, pointsEarned: t.points };
});

const evalPartial1 = evaluateCertificateEligibility(LABS, partialState1);
assert(evalPartial1.isEligible === false, "Partial completion (1 lab done) is NOT eligible");
assert(evalPartial1.completedLabsCount === 1, "Completed labs count is 1/5");
assert(evalPartial1.totalTasksCompleted === 6, "Total tasks completed is 6/32");
assert(evalPartial1.totalVerifiedScore === 100, "Total verified score is 100/500");
assert(evalPartial1.labDetails[0].remainingPoints === 0, "Lab 1 remaining points is 0");
assert(evalPartial1.labDetails[0].isComplete === true, "Lab 1 isComplete is true");
assert(evalPartial1.labDetails[1].remainingPoints === 100, "Lab 2 remaining points is 100");

// Case C: 4 of 5 labs completed with 100/100 (400/500 score, 25/32 tasks)
const partialState4 = JSON.parse(JSON.stringify(emptyState));
for (let i = 0; i < 4; i++) {
  const lab = LABS[i];
  lab.tasks.forEach((t) => {
    partialState4[lab.id][t.id] = { completed: true, pointsEarned: t.points };
  });
}
const evalPartial4 = evaluateCertificateEligibility(LABS, partialState4);
assert(evalPartial4.isEligible === false, "4/5 labs completed is NOT eligible");
assert(evalPartial4.completedLabsCount === 4, "Completed labs count is 4/5");
assert(evalPartial4.totalTasksCompleted === 25, "Tasks resolved is 25/32");
assert(evalPartial4.totalVerifiedScore === 400, "Score is 400/500");

// Case D: 31 of 32 tasks completed (missing just 1 task in Lab 5)
const almostState = JSON.parse(JSON.stringify(partialState4));
// Complete all tasks in Lab 5 EXCEPT the last one
const lab5 = LABS[4];
for (let i = 0; i < lab5.tasks.length - 1; i++) {
  const t = lab5.tasks[i];
  almostState[5][t.id] = { completed: true, pointsEarned: t.points };
}
const evalAlmost = evaluateCertificateEligibility(LABS, almostState);
assert(evalAlmost.isEligible === false, "31/32 tasks completed is NOT eligible");
assert(evalAlmost.totalTasksCompleted === 31, "Total tasks completed is 31");
assert(evalAlmost.completedLabsCount === 4, "Only 4 labs are complete");
assert(evalAlmost.totalVerifiedScore < 500, "Score is less than 500");

// Case E: All 32 tasks completed, but one task got partial points (e.g. hints deducted points, score = 490)
const partialScoreState = JSON.parse(JSON.stringify(emptyState));
LABS.forEach((lab) => {
  lab.tasks.forEach((t) => {
    partialScoreState[lab.id][t.id] = { completed: true, pointsEarned: t.points };
  });
});
// Deduct 10 points on one task
partialScoreState[1][LABS[0].tasks[0].id].pointsEarned = LABS[0].tasks[0].points - 10;
const evalImperfectScore = evaluateCertificateEligibility(LABS, partialScoreState);
assert(evalImperfectScore.isEligible === false, "32/32 tasks with < 500 score (490 pts) is NOT eligible");
assert(evalImperfectScore.completedLabsCount === 4, "Lab with < 100 score is not marked completed");

console.log("\n=== TEST SUITE 3: COMPLETE 100% MASTERY STATE EVALUATION ===");
// Case F: Full completion (5/5 labs, 32/32 tasks, 500/500 points)
const fullMasteryState = JSON.parse(JSON.stringify(emptyState));
LABS.forEach((lab) => {
  lab.tasks.forEach((t) => {
    fullMasteryState[lab.id][t.id] = { completed: true, pointsEarned: t.points };
  });
});

const evalFull = evaluateCertificateEligibility(LABS, fullMasteryState);
assert(evalFull.isEligible === true, "Full mastery state is ELIGIBLE for certificate");
assert(evalFull.completedLabsCount === 5, "Completed labs count is 5/5");
assert(evalFull.totalTasksCompleted === 32, "Total tasks completed is 32/32");
assert(evalFull.totalVerifiedScore === 500, "Total verified score is exactly 500/500");
evalFull.labDetails.forEach((ld) => {
  assert(ld.isComplete === true, `Lab ${ld.labNumber} isComplete is true`);
  assert(ld.score === 100, `Lab ${ld.labNumber} score is 100/100`);
  assert(ld.remainingPoints === 0, `Lab ${ld.labNumber} remainingPoints is 0`);
});

console.log("\n=== TEST SUITE 4: CREDENTIAL ID STABILITY ===");
const id1 = getOrCreateCredentialId();
const id2 = getOrCreateCredentialId();
assert(typeof id1 === "string" && id1.startsWith("CBL-2026-"), `Credential ID follows format CBL-2026-* (got ${id1})`);
assert(id1 === id2, "Credential ID remains stable on subsequent retrievals");

console.log("\n=============================================");
console.log(`TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
console.log("=============================================");

if (failed > 0) {
  process.exit(1);
}
