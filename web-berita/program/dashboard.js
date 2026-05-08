import {
  getUser,
  signOut,
  uploadImage,
  insertNews,
  getNewsByUser,
} from "./supabase.js";
import { initNav } from "./nav.js";

initNav();

const user = getUser();
if (!user) window.location.href = "login.html";

// ── Render stats ─────────────────────────────────────────────────────────────
function renderStats(news) {
  const published = news.filter((n) => n.status === "published").length;
  const pending = news.filter((n) => n.status === "pending").length;
  const rejected = news.filter((n) => n.status === "rejected").length;

  document.getElementById("dashboard_stats").innerHTML = `
    <div class="stat_card">
      <div class="stat_number">${published}</div>
      <div class="stat_label">Published</div>
    </div>
    <div class="stat_card">
      <div class="stat_number">${pending}</div>
      <div class="stat_label">Pending</div>
    </div>
    <div class="stat_card">
      <div class="stat_number">${rejected}</div>
      <div class="stat_label">Rejected</div>
    </div>
  `;
}

// ── Render list ───────────────────────────────────────────────────────────────
function renderList(news) {
  const list = document.getElementById("dashboard_list");

  if (news.length === 0) {
    list.innerHTML = `<div class="dashboard_empty">Kamu belum mengirim berita apapun.</div>`;
    return;
  }

  list.innerHTML = news
    .map(
      (item) => `
    <div class="dashboard_item">
      <img src="${item.image_url}" alt="${item.title}" />
      <div>
        <p class="dashboard_item_title">${item.title}</p>
        <p class="dashboard_item_meta">${item.author} · ${new Date(item.created_at).toLocaleDateString("id-ID")}</p>
      </div>
      <span class="status_badge status_${item.status}">${item.status}</span>
    </div>
  `,
    )
    .join("");
}

// ── Load dashboard ────────────────────────────────────────────────────────────
async function loadDashboard() {
  const news = await getNewsByUser(user.id);
  renderStats(news);
  renderList(news);
}

loadDashboard();

// ── Upload modal (same logic as news.js) ─────────────────────────────────────
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
  const desc = document.getElementById("news_desc").value.trim();
  const content = document.getElementById("news_content").value.trim();
  const author = document.getElementById("news_author").value.trim();
  const file = imageInput.files[0];

  if (!title || !desc || !content || !author || !file)
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
      user_id: user.id,
    });
    await loadDashboard();
    closeModal();
  } catch (err) {
    alert("Gagal menyimpan: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publikasikan";
  }
});
