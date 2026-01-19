function performSearch() {
  const query = document.getElementById('searchQuery').value.trim();
  const resultsBlock = document.getElementById('results');
  resultsBlock.innerHTML = '';

  if (!query) {
    resultsBlock.innerHTML = '<p style="color:red;">Введите запрос для поиска</p>';
    return;
  }

  // Здесь должна быть реальная логика поиска через API
  resultsBlock.innerHTML = `
    <h2>Результаты для: "${query}"</h2>
    <p>Пока нет данных. Подключи API и обрабатывай результаты.</p>
  `;

  // Пример: fetch('https://example.com/api?query=' + encodeURIComponent(query))
  //   .then(res => res.json())
  //   .then(data => { /* отрисовка */ });
}
