const axios = require("axios");
const { BASE_URL } = require("../config");

async function fetchUserContestHistory(handle) {
  const url = `${BASE_URL}/user.rating?handle=${handle}`;
  const res = await axios.get(url);
  return res.data.result;
}

module.exports = fetchUserContestHistory;
