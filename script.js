async function searchByFIO() {
  const last = document.getElementById("last").value.toLowerCase();
  const first = document.getElementById("first").value.toLowerCase();
  const middle = document.getElementById("middle").value.toLowerCase();

  const res = await fetch("data.json");
  const data = await res.json();

  const results = data.filter(p =>
    (!last || p.lastName.toLowerCase().includes(last)) &&
    (!first || p.firstName.toLowerCase().includes(first)) &&
    (!middle || p.middleName.toLowerCase().includes(middle))
  );

  render(results);
}

function render(results) {
  const out = document.getElementById("result");
  out.innerHTML = "";

  if (results.length === 0) {
    out.innerHTML = "<p>Ничего не найдено</p>";
    return;
  }

  results.forEach(p => {
    out.innerHTML += `
      <div>
        <b>${p.lastName} ${p.firstName} ${p.middleName}</b><br>
        ДР: ${p.birth}<br>
        Город: ${p.city}<br>
        Заметки: ${p.notes}
        <hr>
      </div>
    `;
  });
}
