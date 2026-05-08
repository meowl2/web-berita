import { initNav } from "./nav.js";
await initNav();

import {
  getAllNews,
  insertNews,
  deleteNewsById,
  uploadImage,
} from "./supabase.js";

// ─── Constants ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 4;
let currentPage = 0;

// ─── Rendering ───────────────────────────────────────────────────────────────
function totalPages(news) {
  return Math.max(1, Math.ceil(news.length / ITEMS_PER_PAGE));
}

async function renderSect3() {
  const news = await getAllNews();
  const featured = news.filter((n) => n.section === "featured");

  const wrapper = document.getElementById("sect3_dynamic_wrapper");
  const indicator = document.getElementById("sect3_indicator");
  const pages = totalPages(featured);

  if (currentPage >= pages) currentPage = pages - 1;
  if (currentPage < 0) currentPage = 0;

  indicator.textContent = `${currentPage + 1} / ${pages}`;

  wrapper.innerHTML = "";

  if (featured.length === 0) {
    wrapper.innerHTML = `
      <div class="sect3_empty">
        <p>Belum ada berita. Tambahkan berita pertama!</p>
      </div>`;
    return;
  }

  const start = currentPage * ITEMS_PER_PAGE;
  const slice = featured.slice(start, start + ITEMS_PER_PAGE);

  const grid = document.createElement("div");
  grid.className = "berita_sect_3_main";

  slice.forEach((item) => {
    const card = document.createElement("div");
    card.className = "sect3_card";
    card.innerHTML = `
      <a class="sect3_card_link" href="news-detail.html?id=${item.id}">
        <div class="sect3_img_wrap">
          <img src="${item.image_url}" alt="${item.title}" />
        </div>
        <h2>${item.title}</h2>
        <p>${item.description}</p>
      </a>
      <button class="sect3_delete_btn" title="Hapus berita" data-id="${item.id}">✕</button>
    `;
    grid.appendChild(card);
  });

  wrapper.appendChild(grid);

  requestAnimationFrame(() => {
    grid.classList.add("slide-in-active");
  });

  wrapper.querySelectorAll(".sect3_delete_btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      if (confirm("Hapus berita ini?")) {
        await deleteNewsById(id);
        renderSect3();
      }
    });
  });
}

// ─── Pagination ───────────────────────────────────────────────────────────────
document.getElementById("prev_sect3").addEventListener("click", async () => {
  if (currentPage > 0) {
    currentPage--;
    await renderSect3();
  }
});

document.getElementById("next_sect3").addEventListener("click", async () => {
  const news = await getAllNews();
  const featured = news.filter((n) => n.section === "featured");
  if (currentPage < totalPages(featured) - 1) {
    currentPage++;
    await renderSect3();
  }
});

// ─── Modal ───────────────────────────────────────────────────────────────────
const modal = document.getElementById("upload_modal");
const openBtn = document.getElementById("open_upload_modal");
const closeBtn = document.getElementById("close_modal");
const form = document.getElementById("upload_form");
const imageInput = document.getElementById("news_image");
const imagePreview = document.getElementById("image_preview");

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
});

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
  form.reset();
  imagePreview.src = "";
  imagePreview.classList.add("hidden");
}

closeBtn.addEventListener("click", closeModal);
document.getElementById("close_modal_2").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert("Ukuran gambar maksimal 5MB.");
    imageInput.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

document.getElementById("btn_bold").addEventListener("click", () => {
  const ta = document.getElementById("news_content");
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  ta.value =
    ta.value.substring(0, start) + `**${selected}**` + ta.value.substring(end);
});

document.getElementById("btn_italic").addEventListener("click", () => {
  const ta = document.getElementById("news_content");
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  ta.value =
    ta.value.substring(0, start) + `*${selected}*` + ta.value.substring(end);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("news_title").value.trim();
  const author = document.getElementById("news_author").value.trim();
  const desc = document.getElementById("news_desc").value.trim();
  const content = document.getElementById("news_content").value.trim();
  const file = imageInput.files[0];

  if (!title || !desc || !content || !file || !author)
    return alert("Mohon lengkapi semua field.");

  const submitBtn = form.querySelector(".btn_primary");
  submitBtn.disabled = true;
  submitBtn.textContent = "Menyimpan...";

  try {
    const image_url = await uploadImage(file);
    await insertNews({
      title,
      description: desc,
      content,
      image_url,
      section: "featured",
      author,
    });
    currentPage = 0;
    await renderSect3();
    closeModal();
  } catch (err) {
    alert("Gagal menyimpan: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publikasikan";
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
renderSect3();

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function renderLandingCard(item) {
  return `
    <a class="sect_card_link" href="news-detail.html?id=${item.id}">
      <img src="${item.image_url}" alt="${item.title}" />
      <h2>${item.title}</h2>
      <p>${item.description}</p>
    </a>
  `;
}

async function populateLandingPage() {
  const news = await getAllNews();
  if (news.length === 0) return;

  const picked = pickRandom(news, 6);

  const sect1 = document.getElementById("sect1_dynamic");
  const sect2 = document.getElementById("sect2_dynamic");

  if (sect1)
    sect1.innerHTML = `
    <div class="berita_1">
      ${picked[0] ? renderLandingCard(picked[0]) : ""}
      ${picked[1] ? renderLandingCard(picked[1]) : ""}
    </div>
    <div class="trending">
      ${picked[2] ? renderLandingCard(picked[2]) : ""}
    </div>
    <div class="berita_2">
      ${
        picked[3]
          ? `
        <div>
          <h2>${picked[3].title}</h2>
          <p>${picked[3].description}</p>
        </div>`
          : ""
      }
      ${
        picked[4]
          ? `
        <div>
          <h2>${picked[4].title}</h2>
          <p>${picked[4].description}</p>
        </div>`
          : ""
      }
      ${
        picked[5]
          ? `
        <div>
          <h2>${picked[5].title}</h2>
          <p>${picked[5].description}</p>
        </div>`
          : ""
      }
    </div>
  `;

  if (sect2)
    sect2.innerHTML = `
    ${picked[3] ? renderLandingCard(picked[3]) : ""}
    ${picked[4] ? renderLandingCard(picked[4]) : ""}
  `;
}

populateLandingPage();
