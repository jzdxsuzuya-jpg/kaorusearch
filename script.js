async function search() {
  const input = document.getElementById("query");
  const q = input.value.trim();
  if (!q) return;

  const report = document.getElementById("report");
  report.classList.remove("hidden");
  report.innerHTML = `
    <h2>Scanning</h2>
    <div class="scanner"></div>
    <p style="color:#777;">Querying open OSINT sources...</p>
  `;

  const emails = [];
  const usernames = [];

  /* ===== EMAIL → GRAVATAR ===== */
  if (q.includes("@")) {
    const hash = await md5(q.toLowerCase().trim());
    try {
      const r = await fetch(`https://www.gravatar.com/avatar/${hash}?d=404`);
      emails.push(r.ok ? "Gravatar: found" : "Gravatar: not found");
    } catch {
      emails.push("Gravatar: error");
    }
  }

  /* ===== USERNAME → GITHUB ===== */
  try {
    const gh = await fetch(`https://api.github.com/users/${q}`);
    if (gh.ok) {
      const data = await gh.json();
      usernames.push(
        `GitHub: <a href="${data.html_url}" target="_blank">${data.login}</a>`
      );
    }
  } catch {}

  /* ===== USERNAME → REDDIT ===== */
  try {
    const rd = await fetch(`https://www.reddit.com/user/${q}/about.json`);
    if (rd.ok) {
      usernames.push(
        `Reddit: <a href="https://reddit.com/u/${q}" target="_blank">${q}</a>`
      );
    }
  } catch {}

  /* ===== RENDER REPORT ===== */
  report.innerHTML = `
    <h2>Report</h2>

    <div class="card">
      <h3>🔍 Query</h3>
      <p></p>
    </div>

    <div class="grid">
      <div class="card">
        <h3>📧 Emails</h3>
        <ul>
          ${emails.length ? emails.map(e => `<li>${e}</li>`).join("") : "<li>No data</li>"}
        </ul>
      </div>

      <div class="card">
        <h3>👤 Usernames</h3>
        <ul>
          ${usernames.length ? usernames.map(u => `<li>${u}</li>`).join("") : "<li>No matches</li>"}
        </ul>
      </div>

      <div class="card">
        <h3>🌐 Social networks</h3>
        <ul>
          <li>GitHub</li>
          <li>Reddit</li>
        </ul>
      </div>

      <div class="card">
        <h3>🗂 Databases</h3>
        <ul>
          <li>Public OSINT only</li>
        </ul>
      </div>
    </div>
  `;

  report.querySelector("p").textContent = q;
}

/* ===== MD5 FOR GRAVATAR ===== */
async function md5(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", msgUint8);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
