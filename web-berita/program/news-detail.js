import { getNewsById } from "./supabase.js";

const root = document.getElementById("detail_root");

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderNotFound() {
  root.innerHTML = `
    <div class="detail_error">
      <h1>Berita tidak ditemukan</h1>
      <p>Berita yang kamu cari sudah dihapus atau tidak tersedia.</p>
      <a href="index.html" class="detail_back_btn">← Kembali ke Beranda</a>
    </div>
  `;
}

async function render(item) {
  document.title = `ArusTeknologi — ${item.title}`;

  const paragraphs = item.content
    .split(/\n+/)
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim()}</p>`)
    .join("");

        // <div class="detail_tag">Berita</div>;

  root.innerHTML = `
    <article class="detail_article">
      <header class="detail_header">
        <a href="index.html" class="detail_back">← Kembali</a>
        <h1 class="detail_title">${item.title}</h1>
        <p class="detail_meta">
          Oleh ${item.author} &nbsp;·&nbsp; Diterbitkan pada ${formatDate(item.created_at)}
        </p>
        <p class="detail_meta">Diterbitkan pada ${formatDate(item.created_at)}</p>
        <p class="detail_description">${item.description}</p>
      </header>

      <figure class="detail_figure">
        <img src="${item.image_url}" alt="${item.title}" class="detail_img" />
      </figure>

      <div class="detail_body">
        ${paragraphs}
      </div>

      <footer class="detail_footer">
        <a href="index.html" class="detail_back_btn">← Kembali ke Beranda</a>
      </footer>
    </article>
  `;
}

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

if (!id) {
  renderNotFound();
} else {
  getNewsById(id)
    .then((item) => (item ? render(item) : renderNotFound()))
    .catch(() => renderNotFound());
}
    