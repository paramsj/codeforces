const axios = require("axios");
const { BASE_URL } = require("../config");

async function fetchSubmissions(handle, contestId) {
  const url = `${BASE_URL}/contest.status?contestId=${contestId}&handle=${handle}`;
  const res = await axios.get(url);
  return res.data.result;
}

module.exports = fetchSubmissions;