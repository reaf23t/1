/* ==========================================================================
   STARK REPOSITORIES NEWS & MOVIES HUB MODULE
   ========================================================================== */

const MOCK_TECH_NEWS = [
  {
    title: "⚡ Open-Source AI Model Released with 100B Parameters",
    summary: "A comunidade open-source acaba de publicar um modelo generativo capaz de rivalizar com sistemas proprietários de última geração.",
    source: "GitHub Trending & TechCrunch",
    time: "Há 15 minutos"
  },
  {
    title: "🚀 Three.js & WebGL 3.0 Standard Proposed for Web Graphics",
    summary: "Novas especificações para renderização gráfica 3D no navegador prometem aceleração por hardware 5x mais rápida.",
    source: "WebStandards Dev",
    time: "Há 1 hora"
  },
  {
    title: "🤖 Arduino lança nova placa com microprocessador ARM de alta performance",
    summary: "O ecossistema de robótica ganha reforço com novos chips capazes de executar visão computacional direto na borda.",
    source: "Hardware Insider",
    time: "Há 3 horas"
  },
  {
    title: "🛡️ CyberSecurity: Nova arquitetura de criptografia quântica Stark",
    summary: "Pesquisadores desenvolvem protocolo de criptografia pós-quântica resistente a supercomputadores.",
    source: "Stark Defense Feed",
    time: "Há 5 horas"
  }
];

const MOCK_MOVIES = [
  {
    title: "Iron Man (Homem de Ferro)",
    year: "2008",
    rating: "⭐ 9.8 / 10",
    image: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=300&auto=format&fit=crop&q=60"
  },
  {
    title: "Avengers: Endgame",
    year: "2019",
    rating: "⭐ 9.9 / 10",
    image: "https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=300&auto=format&fit=crop&q=60"
  },
  {
    title: "Tron: Legacy",
    year: "2010",
    rating: "⭐ 9.2 / 10",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=60"
  },
  {
    title: "Cyberpunk 2077 Edgerunners",
    year: "2022",
    rating: "⭐ 9.5 / 10",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=60"
  },
  {
    title: "Matrix Resurrections",
    year: "2021",
    rating: "⭐ 8.7 / 10",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=60"
  },
  {
    title: "Interstellar",
    year: "2014",
    rating: "⭐ 9.7 / 10",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=60"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  fetchLiveTechNews();
  renderMoviesList(MOCK_MOVIES);
});

function fetchLiveTechNews() {
  const container = document.getElementById('techNewsContainer');
  if (!container) return;

  container.innerHTML = '';
  MOCK_TECH_NEWS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <h4>${item.title}</h4>
      <p>${item.summary}</p>
      <div class="news-meta">
        <span><i class="fa-solid fa-rss"></i> ${item.source}</span>
        <span><i class="fa-solid fa-clock"></i> ${item.time}</span>
      </div>
    `;
    container.appendChild(card);
  });

  logSystemEvent("Feeds de notícias de repositórios e tecnologia atualizados.");
}

function renderMoviesList(movies) {
  const container = document.getElementById('moviesGridContainer');
  if (!container) return;

  container.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => alert(`Filme Selecionado: ${movie.title} (${movie.year})\nAvaliação JARVIS: ${movie.rating}`);
    card.innerHTML = `
      <img src="${movie.image}" class="movie-poster" alt="${movie.title}" onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300'">
      <div class="movie-info">
        <h5>${movie.title}</h5>
        <p>${movie.year} | ${movie.rating}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function searchMovies() {
  const query = document.getElementById('movieSearchInput').value.toLowerCase();
  if (!query) {
    renderMoviesList(MOCK_MOVIES);
    return;
  }

  const filtered = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query));
  renderMoviesList(filtered);
  logSystemEvent(`Busca de filmes por "${query}" realizada.`);
}
