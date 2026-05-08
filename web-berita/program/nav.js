import { getUser, signOut, getUserProfile } from "./supabase.js";

export async function initNav() {
  const user = getUser();
  const navList = document.querySelector("nav ul");

  const signinLink = navList.querySelector('a[href="#signin"]');
  if (signinLink) signinLink.closest("li").remove();

  if (user) {
    const profile = await getUserProfile(user.id);
    const username = user.user_metadata?.username ?? user.email;

    navList.insertAdjacentHTML(
      "beforeend",
      `
      <li><a href="dashboard.html">📝 ${username}</a></li>
      ${profile?.role === "admin" ? `<li><a href="admin.html">⚙️ Admin</a></li>` : ""}
      <li><button id="nav_logout" class="nav_logout_btn">Logout</button></li>
    `,
    );

    document.getElementById("nav_logout").addEventListener("click", signOut);
  } else {
    navList.insertAdjacentHTML(
      "beforeend",
      `
      <li><a href="login.html">Login</a></li>
    `,
    );
  }
}

export async function getUserProfile(userId) {
  const rows = await dbFetch(`profiles?id=eq.${userId}&select=*`);
  return rows?.[0] ?? null;
}
