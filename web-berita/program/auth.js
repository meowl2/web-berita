import { initNav } from "./nav.js";
initNav();

import { signIn, signUp } from "./supabase.js";

import { getUser } from "./supabase.js";

initNav();

// Redirect if already logged in
if (getUser()) window.location.href = "index.html";

const tabLogin = document.getElementById("tab_login");
const tabRegister = document.getElementById("tab_register");
const loginForm = document.getElementById("login_form");
const registerForm = document.getElementById("register_form");

// Tabs
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login_email").value.trim();
  const password = document.getElementById("login_password").value;
  const error = document.getElementById("login_error");
  const btn = loginForm.querySelector(".btn_primary");

  btn.disabled = true;
  btn.textContent = "Masuk...";
  error.classList.add("hidden");

  try {
    await signIn(email, password);
    window.location.href = "index.html";
  } catch (err) {
    error.textContent = err.message;
    error.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "Masuk";
  }
});

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("reg_username").value.trim();
  const email = document.getElementById("reg_email").value.trim();
  const password = document.getElementById("reg_password").value;
  const error = document.getElementById("reg_error");
  const success = document.getElementById("reg_success");
  const btn = registerForm.querySelector(".btn_primary");

  btn.disabled = true;
  btn.textContent = "Mendaftar...";
  error.classList.add("hidden");
  success.classList.add("hidden");

  try {
    await signUp(email, password, username);
    success.textContent =
      "Pendaftaran berhasil! Silakan cek email untuk konfirmasi.";
    success.classList.remove("hidden");
    registerForm.reset();
  } catch (err) {
    error.textContent = err.message;
    error.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "Daftar";
  }
});
