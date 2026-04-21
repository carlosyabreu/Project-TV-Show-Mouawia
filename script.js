let allEpisodesData = [];

// Helper: Remove HTML tags from summaries for better searching
function stripHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Requirement 3: Updates the "Displaying X/Y episodes" text
function updateCounter(count, total) {
  const countDisplay = document.getElementById("episode-count");
  countDisplay.textContent = `Displaying ${count}/${total} episodes`;
}

// Requirement 3: Fills the dropdown list
function populateSelect(allEpisodes) {
  const select = document.getElementById("episode-select");
  select.innerHTML = '<option value="">All Episodes</option>';
  
  allEpisodes.forEach((episode) => {
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;
    
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    const selectedId = e.target.value;
    if (selectedId === "") {
      makePageForEpisodes(allEpisodesData);
      updateCounter(allEpisodesData.length, allEpisodesData.length);
    } else {
      const selectedEpisode = allEpisodesData.filter(ep => ep.id == selectedId);
      makePageForEpisodes(selectedEpisode);
      updateCounter(1, allEpisodesData.length);
    }
  });
}

// Builds the episode cards grid
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("section");
    episodeCard.className = "episode-card";
    
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    episodeCard.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
      <img src="${episode.image?.medium || ''}" alt="${episode.name}">
      <div class="summary">${episode.summary || ''}</div>
    `;
    rootElem.appendChild(episodeCard);
  });
}

// Requirement 2: Main setup function with Fetch
async function setup() {
  const rootElem = document.getElementById("root");
  
  // Requirement 4: Show loading state
  rootElem.innerHTML = "<p class='loading'>Loading episodes from TVMaze...</p>";

  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    
    if (!response.ok) {
      throw new Error("Could not reach the TVMaze server.");
    }

    allEpisodesData = await response.json();

    // Initial render
    makePageForEpisodes(allEpisodesData);
    populateSelect(allEpisodesData);
    updateCounter(allEpisodesData.length, allEpisodesData.length);

    // Setup Search Input
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allEpisodesData.filter(ep => 
        ep.name.toLowerCase().includes(term) || 
        stripHtml(ep.summary).toLowerCase().includes(term)
      );
      makePageForEpisodes(filtered);
      updateCounter(filtered.length, allEpisodesData.length);
    });

  } catch (error) {
    // Requirement 5: Visual error notification for user
    rootElem.innerHTML = `
      <div class="error-box">
        <p>⚠️ Error: ${error.message}</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    `;
  }
}

window.onload = setup;