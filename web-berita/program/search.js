import { searchNews } from "./supabase.js";
import { initNav } from "./nav.js";

await initNav();

const params = new URLSearchParams(window.location.search);
const query = params.get("q")?.trim() ?? "";

const heading = document.getElementById("search_heading");
const results = document.getElementById("search_results");

heading.textContent = query
  ? `Hasil pencarian: "${query}"`
  : "Masukkan kata kunci pencarian";

if (query) {
  results.innerHTML = `<p style="color:var(--muted-tone)">Mencari...</p>`;

  try {
    const news = await searchNews(query);

    if (news.length === 0) {
      results.innerHTML = `<div class="detail_error"><p>Tidak ada berita yang cocok dengan "<strong>${query}</strong>".</p></div>`;
    } else {
      results.innerHTML = news
        .map(
          (item) => `
        <a href="news-detail.html?id=${item.id}" class="search_result_item">
          <img src="${item.image_url}" alt="${item.title}" />
          <div>
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <span class="search_result_meta">${item.author} · ${new Date(item.created_at).toLocaleDateString("id-ID")}</span>
          </div>
        </a>
      `,
        )
        .join("");
    }
  } catch (err) {
    results.innerHTML = `<p style="color:red">Gagal mencari: ${err.message}</p>`;
  }
}
