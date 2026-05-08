document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search_form');
  const searchInput = document.getElementById('search_input');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") return;

    // Logika Pencarian Sederhana:
    // Jika Anda ingin mengarahkan ke halaman pencarian khusus:
    // window.location.href = `search.html?q=${query}`;

    // Atau filter elemen yang sudah ada di layar:
    filterNews(query);
  });
});

function filterNews(query) {
  // Ambil semua elemen kartu berita (sesuaikan class-nya dengan yang Anda buat di news.js)
  const newsCards = document.querySelectorAll('.berita_sect_1, .sect3_wrapper .card'); 
  
  newsCards.forEach(card => {
    const title = card.innerText.toLowerCase();
    if (title.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}