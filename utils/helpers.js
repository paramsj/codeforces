// function calculateProblemSolveTimes(submissions) {
//   const solveTimes = {};
//   const solved = new Set();

//   submissions.sort((a, b) => a.relativeTimeSeconds - b.relativeTimeSeconds);
//   submissions.forEach(sub => {
//     const key = `${sub.problem.contestId}-${sub.problem.index}`;
//     if (sub.verdict === 'OK' && !solved.has(key)) {
//       solved.add(key);
//       solveTimes[key] = sub.relativeTimeSeconds;
//     }
//   });

//   return solveTimes;
// }

// module.exports = { calculateProblemSolveTimes };

function calculateProblemSolveTimes(submissions) {
  const solveTimes = {};
  const solved = new Set();

  // Only keep first ACs from actual contestants
  submissions
    .filter(
      (sub) =>
        sub.author.participantType === "CONTESTANT" && sub.verdict === "OK"
    )
    .sort((a, b) => a.relativeTimeSeconds - b.relativeTimeSeconds)
    .forEach((sub) => {
      const key = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!solved.has(key)) {
        solved.add(key);
        solveTimes[key] = sub.relativeTimeSeconds;
      }
    });

  return solveTimes;
} 

module.exports = { calculateProblemSolveTimes };