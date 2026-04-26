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
