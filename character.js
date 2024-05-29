document.addEventListener("DOMContentLoaded", (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");
  getCharacterDetails(characterId);
});

async function getCharacterDetails(id) {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${id}`
    );
    const characterDetails = await response.json();
    createCharacterDetailsComponent(characterDetails);

    characterDetails.episode.forEach((e) => {
      getEpisodeInfo(e);
    });

    console.log(characterDetails);
  } catch {
    console.log("Ups... coś poszło nie tak");
  }
}
async function getEpisodeInfo(url) {
  try {
    const response = await fetch(`${url}`);
    const episodeInfo = await response.json();
    createEpisodeListComponent(episodeInfo);
  } catch {
    console.log("Ups... coś poszło nie tak");
  }
}
function setImg() {
  console.log("asd");
}

function createCharacterDetailsComponent(character) {
  const characterDetailsContainer = document.getElementById(
    "character__container"
  );
  const characterDetailsImg = document.createElement("img");

  if (character.image) {
    characterDetailsImg.src = character.image;
    characterDetailsImg.alt = "img character";
    characterDetailsImg.onerror = function () {
      this.src =
        "https://static.vecteezy.com/system/resources/previews/004/639/366/non_2x/error-404-not-found-text-design-vector.jpg";
      console.log("Img not found");
    };
  } else {
    characterDetailsImg.src =
      "https://static.vecteezy.com/system/resources/previews/004/639/366/non_2x/error-404-not-found-text-design-vector.jpg";
    characterDetailsImg.alt = "img not found";
  }

  characterDetailsImg.classList.add("characterInfo__img");

  characterDetailsContainer.appendChild(characterDetailsImg);

  const characterInfoHTML = `
  <span class="characterInfo__span-name">${character.name}</span>
  <span class="characterInfo__span">Gender: ${character.gender}</span>
  <span class="characterInfo__span">Status: ${character.status}</span>
  <span class="characterInfo__span">Location: ${character.location.name}</span>
  <h3>Episode list:</h3>
`;

  characterDetailsContainer.innerHTML += characterInfoHTML;
  const characterEpisodeContainer = document.createElement("div");
  characterEpisodeContainer.classList.add("chracterEpisode__container");
  characterDetailsContainer.appendChild(characterEpisodeContainer);
}

function createEpisodeListComponent(episode) {
  const characterEpisodeContainer = document.querySelector(
    ".chracterEpisode__container"
  );
  const characterEpisodeElem = document.createElement("div");
  characterEpisodeElem.classList.add("chracterEpisode__title");
  characterEpisodeElem.innerHTML = `${episode.episode} - ${episode.name}`;
  characterEpisodeContainer.appendChild(characterEpisodeElem);
}
