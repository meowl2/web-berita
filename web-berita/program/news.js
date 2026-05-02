// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "bitmedia_viral_news";
const ITEMS_PER_PAGE = 4;

// ─── State ────────────────────────────────────────────────────────────────────
let currentPage = 0;

// ─── Storage ─────────────────────────────────────────────────────────────────
function getNews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNews(news) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
}

function addNews(item) {
  const news = getNews();
  news.unshift({ ...item, id: Date.now() }); // newest first
  saveNews(news);
}

function deleteNews(id) {
  const news = getNews().filter((n) => n.id !== id);
  saveNews(news);
  renderSect3();
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function totalPages(news) {
  return Math.max(1, Math.ceil(news.length / ITEMS_PER_PAGE));
}

function renderSect3() {
  const news = getNews();
  const wrapper = document.getElementById("sect3_dynamic_wrapper");
  const indicator = document.getElementById("sect3_indicator");
  const pages = totalPages(news);

  // Clamp current page
  if (currentPage >= pages) currentPage = pages - 1;
  if (currentPage < 0) currentPage = 0;

  indicator.textContent = `${currentPage + 1} / ${pages}`;

  const start = currentPage * ITEMS_PER_PAGE;
  const slice = news.slice(start, start + ITEMS_PER_PAGE);

  wrapper.innerHTML = "";

  if (news.length === 0) {
    wrapper.innerHTML = `
      <div class="sect3_empty">
        <p>Belum ada berita. Tambahkan berita pertama!</p>
      </div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "berita_sect_3_main";

  slice.forEach((item) => {
    const card = document.createElement("div");
    card.className = "sect3_card";
    card.innerHTML = `
      <a class="sect3_card_link" href="news-detail.html?id=${item.id}">
        <div class="sect3_img_wrap">
          <img src="${item.image}" alt="${item.title}" />
        </div>
        <h2>${item.title}</h2>
        <p>${item.desc}</p>
      </a>
      <button class="sect3_delete_btn" title="Hapus berita" data-id="${item.id}">✕</button>
    `;
    grid.appendChild(card);
  });

  wrapper.appendChild(grid);

  // Animate in
  requestAnimationFrame(() => {
    grid.classList.add("slide-in-active");
  });

  // Bind delete buttons
  wrapper.querySelectorAll(".sect3_delete_btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      if (confirm("Hapus berita ini?")) deleteNews(id);
    });
  });
}

// ─── Pagination ───────────────────────────────────────────────────────────────
document.getElementById("prev_sect3").addEventListener("click", () => {
  const news = getNews();
  if (currentPage > 0) {
    currentPage--;
    renderSect3();
  }
});

document.getElementById("next_sect3").addEventListener("click", () => {
  const news = getNews();
  if (currentPage < totalPages(news) - 1) {
    currentPage++;
    renderSect3();
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

// Image preview
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

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("news_title").value.trim();
  const desc = document.getElementById("news_desc").value.trim();
  const content = document.getElementById("news_content").value.trim();
  const file = imageInput.files[0];

  if (!title || !desc || !content || !file) {
    alert("Mohon lengkapi semua field.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    addNews({ title, desc, content, image: ev.target.result });
    currentPage = 0;
    renderSect3();
    closeModal();
  };
  reader.readAsDataURL(file);
});

// ─── Init ─────────────────────────────────────────────────────────────────────
renderSect3();
