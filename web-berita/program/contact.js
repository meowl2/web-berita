import { initNav } from "./nav.js";
await initNav();

const SERVICE_ID = "service_su6ltzs";
const TEMPLATE_ID = "template_8v7780t";
const PUBLIC_KEY = "ZlYeZn3bzeol2W88P";
const AUTOREPLY_TEMPLATE_ID = "template_r17tc4p";

emailjs.init(PUBLIC_KEY);

document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = this.querySelector(".btn_primary");
    const success = document.getElementById("successMsg");
    const error = document.getElementById("errorMsg");

    success.classList.add("hidden");
    error.classList.add("hidden");
    btn.disabled = true;
    btn.textContent = "Mengirim...";

    const params = {
      from_name: document.getElementById("nama").value.trim(),
      from_email: document.getElementById("email").value.trim(),
      message: document.getElementById("pesan").value.trim(),
    };

    try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);        // to you
    await emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, params); // to visitor
    success.classList.remove("hidden");
    this.reset();
    } catch (err) {
      error.classList.remove("hidden");
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = "Kirim Pesan";
    }
  });
