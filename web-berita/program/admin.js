import {
  getUser,
  getAllNewsAdmin,
  updateNewsStatus,
  deleteNewsById,
  getUserProfile,
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
        <button class="btn_delete" data-id="${item.id}">Delete</button>
      </div>
    </div>
  `,
    )
    .join("");

  // Bind buttons
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

  list.querySelectorAll(".btn_delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (confirm("Hapus berita ini permanen?")) {
        await deleteNewsById(Number(btn.dataset.id));
        await loadAdmin();
      }
    });
  });
}

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
