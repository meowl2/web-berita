function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function renderCardHTML(item) {
  return `
    <a class="sect_card_link" href="news-detail.html?id=${item.id}">
      <img src="${item.image_url}" alt="${item.title}" />
      <h2>${item.title}</h2>
      <p>${item.description}</p>
    </a>
  `;
}

async function populateLandingPage() {
  const news = await getAllNews();
  if (news.length === 0) return;

  const picked = pickRandom(news, 5); // sect_1 needs ~3, sect_2 needs 2

  // Sect 1 — slots: berita_1_1, berita_1_2, trending
  document.querySelector(".berita_1_1").innerHTML = renderCardHTML(picked[0]);
  document.querySelector(".berita_1 div:nth-child(2)").innerHTML =
    renderCardHTML(picked[1]);
  document.querySelector(".trending").innerHTML = renderCardHTML(picked[2]);

  // Sect 2
  document.querySelector(".berita_sect_2_1").innerHTML = renderCardHTML(
    picked[3],
  );
  document.querySelector(".berita_sect_2_2").innerHTML = renderCardHTML(
    picked[4] ?? picked[0],
  );
}

populateLandingPage();
