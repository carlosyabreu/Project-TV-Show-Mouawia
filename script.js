/**
 * Mouawia's script implentation
 *
// 1. This function runs first when the page loads
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
// 2. This function builds the HTML
}function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "";

  episodeList.forEach((episode) => {
  
    const episodeCard = document.createElement("section");
    episodeCard.className = "episode-card";

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    const title = document.createElement("h2");
    title.textContent = `${episode.name} (${episodeCode})`;

    const img = document.createElement("img");
    img.src = episode.image.medium;
    img.alt = `Episode: ${episode.name}`; 

    const summary = document.createElement("div"); 
    summary.innerHTML = episode.summary;

    episodeCard.appendChild(title);
    episodeCard.appendChild(img);
    episodeCard.appendChild(summary);

    rootElem.appendChild(episodeCard);
  });

 
  const footer = document.createElement("footer");
  footer.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  document.body.appendChild(footer);
}
// 3. THIS LINE TELLS THE BROWSER TO RUN THE SETUP FUNCTION
window.onload = setup;
*/

// IMPLEMENTATION BY CARLOS ABREU

// Global variable to store all episodes
let allEpisodesData = [];

// Helper function to strip HTML tags from a string
function stripHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Function to filter episodes based on search term (case‑insensitive, name + summary)
function filterEpisodes(searchTerm, episodes) {
  if (!searchTerm.trim()) return episodes;
  const term = searchTerm.trim().toLowerCase();
  return episodes.filter(episode => {
    const nameMatch = episode.name.toLowerCase().includes(term);
    const summaryText = stripHtml(episode.summary);
    const summaryMatch = summaryText.toLowerCase().includes(term);
    return nameMatch || summaryMatch;
  });
}

// Function to render episodes and update the result count
function makePageForEpisodes(episodeList, searchTerm = "") {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "";

  // Update result count display
  const countElem = document.getElementById("episode-count");
  if (countElem) {
    const total = episodeList.length;
    const termDisplay = searchTerm.trim() ? ` matching "${searchTerm}"` : "";
    countElem.textContent = `Found ${total} episode${total !== 1 ? "s" : ""}${termDisplay}`;
  }

  // If no episodes match, show a message
  if (episodeList.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No episodes match your search.";
    noResults.style.textAlign = "center";
    noResults.style.width = "100%";
    rootElem.appendChild(noResults);
    return;
  }

  // Create cards for each episode
  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("section");
    episodeCard.className = "episode-card";

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    const title = document.createElement("h2");
    title.textContent = `${episode.name} (${episodeCode})`;

    const img = document.createElement("img");
    img.src = episode.image?.medium || "";
    img.alt = `Episode: ${episode.name}`;

    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;

    episodeCard.appendChild(title);
    episodeCard.appendChild(img);
    episodeCard.appendChild(summary);

    rootElem.appendChild(episodeCard);
  });
}

// Initial setup: load episodes, create search UI, and render everything
function setup() {
  // Get all episodes from the provided function
  allEpisodesData = getAllEpisodes();

  // Create search container above the episodes grid
  const rootElem = document.getElementById("root");
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search episodes (name or summary)...";
  searchInput.autocomplete = "off";

  const countDisplay = document.createElement("div");
  countDisplay.id = "episode-count";
  countDisplay.className = "episode-count";

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(countDisplay);

  // Insert search container before the root element
  rootElem.parentNode.insertBefore(searchContainer, rootElem);

  // Create footer once (avoid duplicates)
  const footer = document.createElement("footer");
  footer.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  document.body.appendChild(footer);

  // Live search event listener
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    const filtered = filterEpisodes(searchTerm, allEpisodesData);
    makePageForEpisodes(filtered, searchTerm);
  });

  // Initial render of all episodes
  makePageForEpisodes(allEpisodesData, "");
}

// Run setup when the page loads
window.onload = setup;
