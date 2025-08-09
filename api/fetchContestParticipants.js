const axios = require("axios");
const { BASE_URL } = require("../config");

async function fetchContestParticipants(contestId) {
  const url = `${BASE_URL}/contest.standings?contestId=${contestId}&from=1&count=15000`;
  const res = await axios.get(url);
  return res.data.result.rows.map(row => row.party.members[0].handle);
}

module.exports = fetchContestParticipants