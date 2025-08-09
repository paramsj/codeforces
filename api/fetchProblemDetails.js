function extractProblemDetails(submissions) {
  const problemMap = new Map();

  submissions.forEach(sub => {
    const problem = sub.problem;
    const key = `${problem.contestId}-${problem.index}`;
    if (!problemMap.has(key)) {
      problemMap.set(key, {
        name: problem.name,
        index: problem.index,
        contestId: problem.contestId,
        rating: problem.rating || null,
        tags: problem.tags || [],
      });
    }
  });

  return Array.from(problemMap.values());
}

module.exports = extractProblemDetails;
