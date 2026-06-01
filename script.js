const games = [
  {
    id: 1,
    title: "Ultrakill",
    image: "https://images.unsplash.com/photo-1616588587683-0e5b5f7c6e6a?w=800",
    desc: "Um FPS infernal ultrarrápido inspirado em Quake e Doom.",
    pros: ["Combate extremamente satisfatório", "Trilha sonora incrível", "Movimento fluido e verticalidade"],
    cons: ["Muito difícil para iniciantes", "Conteúdo pode acabar rápido", "Otimização variável"],
  },
  {
    id: 2,
    title: "Peglin",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a26?w=800",
    desc: "Roguelike de pachinko com mecânicas profundas e humor.",
    pros: ["Altamente viciante", "Muitas builds diferentes", "Mecânicas únicas"],
    cons: ["Sorte influencia muito", "Curva de aprendizado íngreme"],
  },
  {
    id: 3,
    title: "Skul: The Hero Slayer",
    image: "https://images.unsplash.com/photo-1551105370-0f2c7c8f7f5d?w=800",
    desc: "Roguelite de ação 2D com troca de crânios e combate dinâmico.",
    pros: ["Excelente pixel art", "Muitas habilidades", "Replayability alta"],
    cons: ["Controles um pouco duros", "Alguns chefes frustrantes"],
  },
  {
    id: 4,
    title: "Castle Crashers",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    desc: "Beat 'em up cooperativo clássico com humor e muito carisma.",
    pros: ["Ótimo para jogar com amigos", "Humor excelente", "Muitos personagens"],
    cons: ["Gráficos datados", "Historia simples"],
  },
  {
    id: 5,
    title: "Clone Drone in the Danger Zone",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800",
    desc: "Jogo de robôs com espadas em arenas mortais.",
    pros: ["Física divertida", "Multijogador caótico", "Muito criativo"],
    cons: ["Comunidade menor", "Curva de aprendizado alta"],
  },
  {
    id: 6,
    title: "Muck",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    desc: "Survival roguelike minimalista e absurdamente divertido.",
    pros: ["Muito divertido em grupo", "Progressão rápida", "Humor involuntário"],
    cons: ["Gráficos simples", "Repetitivo após muitas runs"],
  }
];

let currentGameId = null;
let data = {};

// Carregar dados do localStorage
function loadData() {
  const saved = localStorage.getItem('hiddenGemsData');
  if (saved) data = JSON.parse(saved);
  else {
    games.forEach(game => {
      data[game.id] = {
        good: 0, bad: 0,
        easy: 0, hard: 0,
        comments: []
      };
    });
    saveData();
  }
}

function saveData() {
  localStorage.setItem('hiddenGemsData', JSON.stringify(data));
}

// Renderizar grid
function renderGames() {
  const grid = document.getElementById('gamesGrid');
  grid.innerHTML = '';

  games.forEach(game => {
    const gameData = data[game.id] || {good:0, bad:0};
    const totalVotes = gameData.good + gameData.bad;
    const approval = totalVotes ? Math.round((gameData.good / totalVotes) * 100) : 50;

    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}">
      <div class="info">
        <h3>${game.title}</h3>
        <p>${approval}% gostaram</p>
      </div>
    `;
    card.onclick = () => openModal(game);
    grid.appendChild(card);
  });
}

function openModal(game) {
  currentGameId = game.id;
  const gameData = data[game.id];

  document.getElementById('modalImage').src = game.image;
  document.getElementById('modalTitle').textContent = game.title;
  document.getElementById('modalDesc').textContent = game.desc;

  // Pros e Cons
  const prosList = document.getElementById('prosList');
  const consList = document.getElementById('consList');
  prosList.innerHTML = game.pros.map(p => `<li>${p}</li>`).join('');
  consList.innerHTML = game.cons.map(c => `<li>${c}</li>`).join('');

  // Ratings
  document.getElementById('goodCount').textContent = gameData.good;
  document.getElementById('badCount').textContent = gameData.bad;
  document.getElementById('easyCount').textContent = gameData.easy;
  document.getElementById('hardCount').textContent = gameData.hard;

  // Comentários
  renderComments();

  document.getElementById('gameModal').style.display = 'block';
}

function voteGame(type) {
  if (!currentGameId) return;
  data[currentGameId][type]++;
  saveData();
  openModal(games.find(g => g.id === currentGameId));
}

function voteDifficulty(type) {
  if (!currentGameId) return;
  data[currentGameId][type]++;
  saveData();
  openModal(games.find(g => g.id === currentGameId));
}

function renderComments() {
  const container = document.getElementById('commentsList');
  const comments = data[currentGameId].comments || [];
  container.innerHTML = '';

  comments.forEach((comment, index) => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <div class="comment-header">
        <span><strong>${comment.author}</strong> • ${comment.time}</span>
        <button class="report-btn" onclick="reportComment(${index})">Denunciar (${comment.reports})</button>
      </div>
      <p>${comment.text}</p>
    `;
    container.appendChild(div);
  });
}

function reportComment(index) {
  const comments = data[currentGameId].comments;
  comments[index].reports = (comments[index].reports || 0) + 1;

  if (comments[index].reports >= 10) {
    comments.splice(index, 1);
    alert("Comentário removido por excesso de denúncias.");
  } else {
    alert("Comentário denunciado!");
  }

  saveData();
  renderComments();
}

// Formulário de comentário
document.getElementById('commentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentGameId) return;

  const author = document.getElementById('commentAuthor').value.trim() || "Anônimo";
  const text = document.getElementById('commentText').value.trim();

  if (!text) return;

  if (!data[currentGameId].comments) data[currentGameId].comments = [];

  data[currentGameId].comments.unshift({
    author,
    text,
    time: new Date().toLocaleDateString('pt-BR'),
    reports: 0
  });

  saveData();
  renderComments();

  e.target.reset();
});

// Fechar modal
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('gameModal').style.display = 'none';
});

// Inicialização
loadData();
renderGames();
