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
