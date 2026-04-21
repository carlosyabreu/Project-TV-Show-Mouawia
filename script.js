let allEpisodesData = [];

function stripHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear the loading message or old episodes

  if (episodeList.length === 0) {
    rootElem.innerHTML = "<p>No episodes match your search.</p>";
    return;
  }

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("section");
    episodeCard.className = "episode-card";
    
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    episodeCard.innerHTML = `
      <h2>${episode.name} (${episodeCode})</h2>
      <img src="${episode.image?.medium || ''}" alt="${episode.name}">
      <div>${episode.summary || ''}</div>
    `;
    rootElem.appendChild(episodeCard);
  });
}

// Level 300: Fetch data from API
async function setup() {
  const rootElem = document.getElementById("root");
  
  // Requirement 4: Show loading message
  rootElem.innerHTML = "<p class='loading'>Loading episodes from TVMaze... please wait.</p>";

  try {
    // Requirement 2: Fetching from the API URL
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    
    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }

    allEpisodesData = await response.json();

    // Requirement 3: Render only once after fetching
    makePageForEpisodes(allEpisodesData);

    // Setup Search (Requirement remains from Level 200)
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allEpisodesData.filter(ep => 
        ep.name.toLowerCase().includes(term) || 
        stripHtml(ep.summary).toLowerCase().includes(term)
      );
      makePageForEpisodes(filtered);
    });

  } catch (error) {
    // Requirement 5: Notify the user of an error (not just console.log)
    rootElem.innerHTML = `
      <div class="error">
        <p>⚠️ Sorry, we couldn't load the episodes right now.</p>
        <p>Technical details: ${error.message}</p>
      </div>
    `;
  }
}

window.onload = setup;
