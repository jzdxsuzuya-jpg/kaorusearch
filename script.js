async function search() {
  const last = document.getElementById("lastname").value.trim().toLowerCase();
  const first = document.getElementById("firstname").value.trim().toLowerCase();
  const middle = document.getElementById("middlename").value.trim().toLowerCase();

  const out = document.getElementById("results");
  out.innerHTML = "<p>Поиск...</p>";

  const res = await fetch("database.json");
  const db = await res.json();

  const found = db.filter(p =>
    (!last || p.lastname.toLowerCase().includes(last)) &&
    (!first || p.firstname.toLowerCase().includes(first)) &&
    (!middle || p.middlename.toLowerCase().includes(middle))
  );

  out.innerHTML = "";

  if (found.length === 0) {
    out.innerHTML = "<p>Ничего не найдено</p>";
    return;
  }

  found.forEach(p => {
    out.innerHTML += `
      <div class="card">
        <b>${p.lastname} ${p.firstname} ${p.middlename}</b><br>
        📅 Дата рождения: <span>${p.birth}</span><br>
        🏙 Город: <span>${p.city}</span><br>
        📝 Заметка: <span>${p.info}</span>
      </div>
    `;
  });
}
