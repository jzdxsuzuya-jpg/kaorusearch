function search() {
  const q = document.getElementById("query").value.trim();
  if (!q) return;

  const report = document.getElementById("report");
  report.classList.add("hidden");
  report.innerHTML = `
    <h2>Scanning</h2>
    <div class="scanner"></div>
    <p style="color:#777;">Collecting data from sources...</p>
  `;

  report.classList.remove("hidden");

  setTimeout(() => {
    report.innerHTML = `
      <h2>Report</h2>

      <div class="card">
        <h3>🔍 Query</h3>
        <p>${q}</p>
      </div>

      <div class="grid">
        <div class="card">
          <h3>📧 Emails</h3>
          <ul><li>Not found</li></ul>
        </div>

        <div class="card">
          <h3>👤 Usernames</h3>
          <ul><li>Not found</li></ul>
        </div>

        <div class="card">
          <h3>🌐 Social networks</h3>
          <ul><li>No matches</li></ul>
        </div>

        <div class="card">
          <h3>🗂 Databases</h3>
          <ul><li>No leaks detected</li></ul>
        </div>
      </div>
    `;
  }, 1600);
}
