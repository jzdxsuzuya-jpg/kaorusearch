function search() {
  const q = document.getElementById("query").value.trim();
  if (!q) return;

  document.getElementById("qtext").textContent = q;
  document.getElementById("report").classList.remove("hidden");
}
