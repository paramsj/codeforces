const fs = require("fs");
const path = require("path");
const fetchContestParticipants = require("./api/fetchContestParticipants");
const fetchUserContestHistory = require("./api/fetchUserContestHistory");
const fetchSubmissions = require("./api/fetchSubmissions");
const extractProblemDetails = require("./api/fetchProblemDetails");
const { calculateProblemSolveTimes } = require("./utils/helpers");

const contestIds = [2124, 2102, 2122, 2119 , 2107 , 2114]; // The 4 contests
const OUTPUT_FILE = path.join(__dirname, "dataset/output.csv");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function processContest(contestId, output) {
  console.log(`Fetching participants for contest ${contestId}...`);
  const handles = await fetchContestParticipants(contestId);
  console.log(`Found ${handles.length} participants in contest ${contestId}`);

  for (const handle of handles) {
    console.log(`Processing ${handle} for contest ${contestId}`);
    try {
      // Fetch history to get oldRating for THIS contest
      const history = await fetchUserContestHistory(handle);
      const contestHistory = history.find(h => h.contestId === contestId);
      const oldRating = contestHistory ? contestHistory.oldRating : "";

      await delay(500); // avoid hitting rate limits
      const submissions = await fetchSubmissions(handle, contestId);
      await delay(500); // extra delay before next user

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
    } catch (err) {
      console.error(`Error for ${handle} in contest ${contestId}:`, err.message);
    }
  }
}

async function main() {
  const output = [];

  for (const contestId of contestIds) {
    await processContest(contestId, output);
    await delay(1000); // short break between contests
  }

  const header = "handle,contestId,problemIndex,problemName,rating,oldRating,tags,solveTime\n";
  const csv = output.map(o => Object.values(o).join(",")).join("\n");
  fs.writeFileSync(OUTPUT_FILE, header + csv);
  console.log(`Data written to ${OUTPUT_FILE}`);
}

main();
