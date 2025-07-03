// DOM Elements
const gamesContainer = document.getElementById('games-container');
const showAllBtn = document.getElementById('showAll');
const showFundedBtn = document.getElementById('showFunded');
const showUnfundedBtn = document.getElementById('showUnfunded');

// Stats Elements
const totalGamesEl = document.getElementById('total-games');
const totalFundingEl = document.getElementById('total-funding');
const avgGoalEl = document.getElementById('avg-goal');
const avgPledgedEl = document.getElementById('avg-pledged');
const unfundedCountEl = document.getElementById('unfunded-count');
const topGame1El = document.getElementById('top-game1');
const topGame2El = document.getElementById('top-game2');

// Initialize
let currentFilter = 'all';

// Display all games initially
displayGames(games);
updateStats(games);

// Filter Buttons Event Listeners
showAllBtn.addEventListener('click', () => {
  currentFilter = 'all';
  updateActiveButton();
  displayGames(games);
  updateStats(games);
});

showFundedBtn.addEventListener('click', () => {
  currentFilter = 'funded';
  updateActiveButton();
  const fundedGames = games.filter(game => game.pledged >= game.goal);
  displayGames(fundedGames);
  updateStats(fundedGames);
});

showUnfundedBtn.addEventListener('click', () => {
  currentFilter = 'unfunded';
  updateActiveButton();
  const unfundedGames = games.filter(game => game.pledged < game.goal);
  displayGames(unfundedGames);
  updateStats(unfundedGames);
});

// Helper Functions
function updateActiveButton() {
  showAllBtn.classList.remove('active');
  showFundedBtn.classList.remove('active');
  showUnfundedBtn.classList.remove('active');
  
  if (currentFilter === 'all') {
    showAllBtn.classList.add('active');
  } else if (currentFilter === 'funded') {
    showFundedBtn.classList.add('active');
  } else {
    showUnfundedBtn.classList.add('active');
  }
}

function displayGames(gamesToDisplay) {
  gamesContainer.innerHTML = '';
  
  if (gamesToDisplay.length === 0) {
    gamesContainer.innerHTML = '<p class="no-games">No games match your filter criteria.</p>';
    return;
  }
  
  gamesToDisplay.forEach(game => {
    const isFunded = game.pledged >= game.goal;
    const progressPercentage = Math.min((game.pledged / game.goal) * 100, 100);
    
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    
    gameCard.innerHTML = `
      <img src="${game.image}" 
           alt="${game.title}" 
           class="game-image"
           onerror="this.onerror=null; this.setAttribute('data-error', 'true'); this.style.display='flex'; this.innerHTML='Image failed to load';">
      <div class="game-info">
        <h3 class="game-title">${game.title}</h3>
        <p class="game-description">${game.description}</p>
        <div class="funding-info">
          <span>$${game.pledged.toLocaleString()}</span>
          <span class="${isFunded ? 'funded' : 'unfunded'}">
            ${isFunded ? 'Funded!' : `${progressPercentage.toFixed(0)}%`}
          </span>
        </div>
        <div class="funding-progress">
          <div class="progress-bar" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="funding-info">
          <span>${game.backers} backers</span>
          <span>${game.daysLeft} days left</span>
        </div>
      </div>
    `;
    
    gamesContainer.appendChild(gameCard);
  });
}

function updateStats(gamesArray) {
  // Basic stats
  totalGamesEl.textContent = gamesArray.length;
  
  const totalFunding = gamesArray.reduce((sum, game) => sum + game.pledged, 0);
  totalFundingEl.textContent = `$${totalFunding.toLocaleString()}`;
  
  const avgGoal = gamesArray.reduce((sum, game) => sum + game.goal, 0) / gamesArray.length || 0;
  avgGoalEl.textContent = `$${Math.round(avgGoal).toLocaleString()}`;
  
  const avgPledged = gamesArray.reduce((sum, game) => sum + game.pledged, 0) / gamesArray.length || 0;
  avgPledgedEl.textContent = `$${Math.round(avgPledged).toLocaleString()}`;
  
  // Unfunded count
  const unfundedCount = gamesArray.filter(game => game.pledged < game.goal).length;
  unfundedCountEl.textContent = unfundedCount;
  
  // Top funded games
  const sortedGames = [...gamesArray].sort((a, b) => b.pledged - a.pledged);
  
  if (sortedGames.length > 0) {
    topGame1El.textContent = `${sortedGames[0].title} ($${sortedGames[0].pledged.toLocaleString()})`;
  } else {
    topGame1El.textContent = '-';
  }
  
  if (sortedGames.length > 1) {
    topGame2El.textContent = `${sortedGames[1].title} ($${sortedGames[1].pledged.toLocaleString()})`;
  } else {
    topGame2El.textContent = '-';
  }
}