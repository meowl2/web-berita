fetch("http://localhost/bitmedia/get_berita.php")
  .then((res) => res.json())
  .then((data) => {
    let container = document.querySelector(".berita_2");

    container.innerHTML = "";

    data.forEach((item) => {
      container.innerHTML += `
        <div>
          <h2>${item.judul}</h2>
          <p>${item.isi.substring(0, 100)}...</p>
        </div>
      `;
    });
  });

const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 1000,
  delay: 100,
  reset: true,
});

sr.reveal(".container", { origin: "bottom" });
sr.reveal("", {});
sr.reveal(".berita_1 div", { interval: 200 });
sr.reveal(".berita_2 div, .trending div", { interval: 100 });

