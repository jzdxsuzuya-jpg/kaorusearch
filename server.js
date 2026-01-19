import express from "express";
import axios from "axios";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());

const PORT = 3001;

/* helpers */
const md5 = (str) =>
  crypto.createHash("md5").update(str.trim().toLowerCase()).digest("hex");

/* SEARCH */
app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ error: "Empty query" });

  const result = {
    query: q,
    emails: [],
    usernames: [],
    socials: [],
    databases: []
  };

  /* EMAIL → Gravatar */
  if (q.includes("@")) {
    const hash = md5(q);
    try {
      await axios.get(`https://www.gravatar.com/avatar/${hash}?d=404`);
      result.emails.push({
        source: "Gravatar",
        found: true
      });
    } catch {
      result.emails.push({
        source: "Gravatar",
        found: false
      });
    }
  }

  /* USERNAME → GitHub */
  try {
    const gh = await axios.get(`https://api.github.com/users/${q}`);
    result.usernames.push({
      source: "GitHub",
      url: gh.data.html_url,
      repos: gh.data.public_repos
    });
  } catch {}

  /* USERNAME → Reddit */
  try {
    const rd = await axios.get(`https://www.reddit.com/user/${q}/about.json`);
    result.usernames.push({
      source: "Reddit",
      karma: rd.data.data.total_karma
    });
  } catch {}

  res.json(result);
});

app.listen(PORT, () =>
  console.log(`Kaoru OSINT backend running on ${PORT}`)
);
