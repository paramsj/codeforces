const fs = require("fs");
const path = require("path");
const fetchContestParticipants = require("./api/fetchContestParticipants");
const fetchUserContestHistory = require("./api/fetchUserContestHistory");
const fetchSubmissions = require("./api/fetchSubmissions");
const extractProblemDetails = require("./api/fetchProblemDetails");
const { calculateProblemSolveTimes } = require("./utils/helpers");

const contestId = 2124; // Replace with desired contest ID

async function main() {
  const handles = await fetchContestParticipants(contestId);
  console.log(`Fetched ${handles.length} participants from contest ${contestId}`);
  // taking every 10th only
  const sampledHandles = handles.filter((_, index) => index % 10 === 0);
  const output = [];

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  await delay(1000);
  for (const handle of sampledHandles) {
    console.log(`Processing user: ${handle}`);
    try {
      const history = await fetchUserContestHistory(handle);
      const pastContests = history.filter(h => h.contestId < contestId);
      const recent = pastContests.slice(-10);
      await delay(750);
      for (const contest of recent) {
        const { contestId: pastContestId, oldRating } = contest;
        
        const submissions = await fetchSubmissions(handle, pastContestId);
        await delay(500);
        const solveTimes = calculateProblemSolveTimes(submissions);
        const problems = extractProblemDetails(submissions);

        for (const problem of problems) {
          const key = `${problem.contestId}-${problem.index}`;
          if (solveTimes[key]) {
            output.push({
              handle,
              contestId: problem.contestId,
              problemIndex: problem.index,
              problemName: problem.name,
              rating: problem.rating,
              oldRating,
              tags: problem.tags.join(","),
              solveTime: solveTimes[key],
            });
          }
        }
      }
    } catch (err) {
      console.error(`Error for ${handle}:`, err.message);
    }
  }

  const header = "handle,contestId,problemIndex,problemName,rating,oldRating,tags,solveTime\n";
  const csv = output.map(o => Object.values(o).join(",")).join("\n");
  fs.writeFileSync(path.join(__dirname, "dataset/output.csv"), header + csv);
}

main();
