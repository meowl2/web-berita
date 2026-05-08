import { getUser, signOut, getUserProfile } from "./supabase.js";

export async function initNav() {
  const user = getUser();
  const navList = document.querySelector("nav ul");

  const signinLink = navList.querySelector('a[href="#signin"]');
  if (signinLink) signinLink.closest("li").remove();

  if (user) {
    const profile = await getUserProfile(user.id).catch(() => null);
    const username = profile?.username ?? user.email.split("@")[0];

    navList.insertAdjacentHTML(
      "beforeend", `
      ${profile?.role === "admin" ? `<li><a href="admin.html">Admin</a></li>` : ""}
      <li class="nav_profile">
        <button class="nav_profile_btn" id="nav_profile_btn">
          <div class="nav_avatar">${username.charAt(0).toUpperCase()}</div>
          <span>${username}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 8L1 3h10z"/>
          </svg>
        </button>
        <div class="nav_dropdown" id="nav_dropdown">
          <a href="dashboard.html" class="nav_dropdown_item">Dashboard</a>
          <button class="nav_dropdown_item nav_dropdown_logout" id="nav_logout">Logout</button>
        </div>
      </li>
    `,);

    document.getElementById("nav_logout").addEventListener("click", signOut);
    document.getElementById("nav_profile_btn").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("nav_dropdown").classList.toggle("active");
    });

    document.addEventListener("click", () => {
      document.getElementById("nav_dropdown")?.classList.remove("active");
    });
  } else {
    navList.insertAdjacentHTML(
      "beforeend",
      `
      <li><a href="login.html">Login</a></li>
    `,
    );
  }
}
