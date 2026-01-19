async function search() {
  const q = document.getElementById("query").value.trim();
  if (!q) return;

  const report = document.getElementById("report");
  report.classList.remove("hidden");
  report.innerHTML = `
    <h2>Scanning</h2>
    <div class="scanner"></div>
    <p>Querying real OSINT sources...</p>
  `;

  try {
    const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();

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
            ${data.emails.length
              ? data.emails.map(e => `<li>${e.source}: ${e.found ? "Found" : "Not found"}</li>`).join("")
              : "<li>No data</li>"}
          </ul>
        </div>

        <div class="card">
          <h3>👤 Usernames</h3>
          <ul>
            ${data.usernames.length
              ? data.usernames.map(u =>
                `<li>${u.source}${u.url ? ` — <a href="${u.url}" target="_blank">profile</a>` : ""}</li>`
              ).join("")
              : "<li>No matches</li>"}
          </ul>
        </div>

        <div class="card">
          <h3>🌐 Social networks</h3>
          <ul><li>See usernames</li></ul>
        </div>

        <div class="card">
          <h3>🗂 Databases</h3>
          <ul><li>HIBP (optional)</li></ul>
        </div>
      </div>
    `;

    report.querySelector("p").textContent = q;

  } catch {
    report.innerHTML = `<p>Error contacting OSINT backend</p>`;
  }
}
