import { getUser, signOut } from "./supabase.js";

export function initNav() {
  const user = getUser();
  const navList = document.querySelector("nav ul");

  // Remove old signin link if present
  const signinLink = navList.querySelector('a[href="#signin"]');
  if (signinLink) signinLink.closest("li").remove();

  if (user) {
    // Get profile for username
    const username = user.user_metadata?.username ?? user.email;

    navList.insertAdjacentHTML(
      "beforeend",
      `
      <li><a href="dashboard.html" id="nav_dashboard">📝 ${username}</a></li>
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
