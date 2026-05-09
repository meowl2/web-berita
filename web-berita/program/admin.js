import {
  getUser,
  getAllNewsAdmin,
  updateNewsStatus,
  deleteNewsById,
  getUserProfile,
  updateNews,
  uploadImage,
} from "./supabase.js";
import { initNav } from "./nav.js";

await initNav();

// Redirect if not admin
const user = getUser();
if (!user) window.location.href = "login.html";

const profile = await getUserProfile(user.id).catch(() => null);
if (profile?.role !== "admin") window.location.href = "index.html";

let currentStatus = "pending";
let allNews = [];

// ── Load all news ─────────────────────────────────────────────────────────────
async function loadAdmin() {
  allNews = await getAllNewsAdmin();
  renderStats();
  renderList(currentStatus);
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function renderStats() {
  const published = allNews.filter((n) => n.status === "published").length;
  const pending = allNews.filter((n) => n.status === "pending").length;
  const rejected = allNews.filter((n) => n.status === "rejected").length;

  document.getElementById("admin_stats").innerHTML = `
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

// ── List ──────────────────────────────────────────────────────────────────────
function renderList(status) {
  const list = document.getElementById("admin_list");
  const filtered = allNews.filter((n) => n.status === status);

  if (filtered.length === 0) {
    list.innerHTML = `<div class="dashboard_empty">Tidak ada berita ${status}.</div>`;
    return;
  }

  list.innerHTML = filtered
    .map(
      (item) => `
    <div class="admin_item" data-id="${item.id}">
      <img src="${item.image_url}" alt="${item.title}" />
      <div>
        <p class="admin_item_title">${item.title}</p>
        <p class="admin_item_meta">${item.author} · ${new Date(item.created_at).toLocaleDateString("id-ID")}</p>
        <p class="admin_item_meta">${item.description}</p>
      </div>
      <div class="admin_actions">
        ${status !== "published" ? `<button class="btn_approve" data-id="${item.id}">Approve</button>` : ""}
        ${status !== "rejected" ? `<button class="btn_reject" data-id="${item.id}">Reject</button>` : ""}
        <button class="btn_edit" data-id="${item.id}">Edit</button>
        <button class="btn_delete" data-id="${item.id}">Delete</button>
      </div>
    </div>
  `,
    )
    .join("");

  list.querySelectorAll(".btn_approve").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await updateNewsStatus(Number(btn.dataset.id), "published");
      await loadAdmin();
    });
  });

  list.querySelectorAll(".btn_reject").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await updateNewsStatus(Number(btn.dataset.id), "rejected");
      await loadAdmin();
    });
  });

  list.querySelectorAll(".btn_edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = allNews.find((n) => n.id === Number(btn.dataset.id));
      if (item) openEditModal(item);
    });
  });

  list.querySelectorAll(".btn_delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Hapus berita ini permanen?")) {
        await deleteNewsById(Number(btn.dataset.id));
        await loadAdmin();
      }
    });
  });
}

// edit
const editModal = document.getElementById("edit_modal");
const editForm = document.getElementById("edit_form");
const editImageInput = document.getElementById("edit_image");
const editImagePreview = document.getElementById("edit_image_preview");

function openEditModal(item) {
  document.getElementById("edit_news_id").value = item.id;
  document.getElementById("edit_title").value = item.title;
  document.getElementById("edit_author").value = item.author;   
  document.getElementById("edit_desc").value = item.description;
  document.getElementById("edit_content").value = item.content;
  editImagePreview.src = item.image_url;
  editImagePreview.classList.remove("hidden");
  editModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeEditModal() {
  editModal.classList.remove("active");
  document.body.style.overflow = "";
  editForm.reset();
  editImagePreview.src = "";
  editImagePreview.classList.add("hidden");
}

document
  .getElementById("close_edit_modal")
  .addEventListener("click", closeEditModal);
document
  .getElementById("close_edit_modal_2")
  .addEventListener("click", closeEditModal);
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

editImageInput.addEventListener("change", () => {
  const file = editImageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    editImagePreview.src = e.target.result;
    editImagePreview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

document.getElementById("edit_btn_bold").addEventListener("click", () => {
  const ta = document.getElementById("edit_content");
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  ta.value =
    ta.value.substring(0, start) +
    `**${ta.value.substring(start, end)}**` +
    ta.value.substring(end);
});

document.getElementById("edit_btn_italic").addEventListener("click", () => {
  const ta = document.getElementById("edit_content");
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  ta.value =
    ta.value.substring(0, start) +
    `*${ta.value.substring(start, end)}*` +
    ta.value.substring(end);
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = Number(document.getElementById("edit_news_id").value);
  const title = document.getElementById("edit_title").value.trim();
  const author = document.getElementById("edit_author").value.trim();
  const description = document.getElementById("edit_desc").value.trim();
  const content = document.getElementById("edit_content").value.trim();
  const file = editImageInput.files[0];

  if (!title || !description || !content)
    return alert("Mohon lengkapi semua field.");

  const submitBtn = editForm.querySelector(".btn_primary");
  submitBtn.disabled = true;
  submitBtn.textContent = "Menyimpan...";

  try {
    // Admin edits keep existing status
    let fields = { title, description, content, author };
    if (file) fields.image_url = await uploadImage(file);

    await updateNews(id, fields);
    await loadAdmin();
    closeEditModal();
  } catch (err) {
    alert("Gagal menyimpan: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Simpan";
  }
});

// ── Tabs ──────────────────────────────────────────────────────────────────────
document.querySelectorAll(".admin_tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".admin_tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentStatus = tab.dataset.status;
    renderList(currentStatus);
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────
loadAdmin();
