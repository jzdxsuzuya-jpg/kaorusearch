const HIMERA_KEY = "e8ac94ce9871562785f15ed3592089aa";
const HIMERA_BASE = "https://api.himera-search.info/2.0";
async function search() {
  const q = document.getElementById("query").value.trim();
  if (!q) return;

  const report = document.getElementById("report");
  report.classList.remove("hidden");
  report.innerHTML = `
    <h2>Scanning</h2>
    <div class="scanner"></div>
    <p style="color:#777;">Himera API request...</p>
  `;

  try {
    const body = new URLSearchParams({
      key: HIMERA_KEY,
      email: q
    });

    const res = await fetch(`${HIMERA_BASE}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    });

    const data = await res.json();

    renderHimeraResult(q, data);
  } catch (e) {
    report.innerHTML = `
      <div class="card">
        <h3>❌ Error</h3>
        <p>Request failed (CORS or network)</p>
      </div>
    `;
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

function renderHimeraResult(query, data) {
  const report = document.getElementById("report");

  if (data.error) {
    report.innerHTML = `
      <div class="card">
        <h3>⚠️ Error</h3>
        <p>${data.error}</p>
      </div>
    `;
    return;
  }

  if (data.status === "not_found") {
    report.innerHTML = `
      <div class="card">
        <h3>🔍 Query</h3>
        <p>${query}</p>
      </div>
      <div class="card">
        <h3>🗂 Himera</h3>
        <p>No data found</p>
      </div>
    `;
    return;
  }

  report.innerHTML = `
    <h2>Report</h2>

    <div class="card">
      <h3>🔍 Query</h3>
      <p>${query}</p>
    </div>

    ${data.data.map(row => `
      <div class="card">
        <h3>📄 Source</h3>
        <ul>
          ${Object.entries(row).map(
            ([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`
          ).join("")}
        </ul>
      </div>
    `).join("")}

    ${data.url ? `
      <div class="card">
        <a href="${data.url}" target="_blank">Open full report</a>
      </div>
    ` : ""}
  `;
}
