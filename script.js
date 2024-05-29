let currentPage = 1;

async function getCharacter(page = 1, query = "", params = "") {
  currentPage = page;
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${page}${query}${params}`
    );
    const characters = await response.json();
    console.log(characters);
    createCharacterComponent(characters.results);
    pagination(characters.info.pages, query, params);
    updateURL(page, query, params);
  } catch (error) {
    console.error(`Ups coś poszło nie tak: ${error}`);
  }
}

const createCharacterComponent = (characterArray) => {
  const charactersContainer = document.getElementById("charactersContainer");
  charactersContainer.innerHTML = "";
  characterArray.forEach((character) => {
    const characterTile = document.createElement("a");
    characterTile.setAttribute("href", `character.html?id=${character.id}`);
    characterTile.classList.add("character__Tile");
    characterTile.innerHTML = `
      <div class="character__ImgContainer">
        <img class="character__Image" src="${character.image}" alt="character image" />
      </div>
      <span class="character__Title">${character.name}</span>
      <span class="character__Species">${character.species}</span>
      `;

    charactersContainer.appendChild(characterTile);
  });
};
function updateURL(page, query, params) {
  const url = new URL(window.location);
  url.searchParams.set("page", page);
  if (query) url.searchParams.set("query", query);
  if (params) url.searchParams.set("params", params);
  window.history.pushState({}, "", url);
}
window.onpopstate = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = parseInt(urlParams.get("page")) || 1;
  const query = urlParams.get("query") || "";
  const params = urlParams.get("params") || "";
  getCharacter(page, query, params);
};
const pagination = (countPage, query, params) => {
  const paginationContainer = document.getElementById("pagination__Container");
  const maxVisiblePages = 6;
  paginationContainer.innerHTML = "";

  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(countPage, startPage + maxVisiblePages - 1);

  const renderPagination = () => {
    // Prev Button
    if (currentPage > 1) {
      const prevBtn = document.createElement("div");
      prevBtn.innerHTML = `<span class="pagination_NavBtn">Previous</span>`;
      paginationContainer.appendChild(prevBtn);
      prevBtn.addEventListener("click", function () {
        currentPage -= 1;
        getCharacter(currentPage, query, params);
      });
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageElem = document.createElement("div");
      pageElem.innerHTML = `<span class="pagination__Btn">${i}</span>`;
      if (i === currentPage) {
        pageElem.querySelector("span").classList.add("active");
      }
      pageElem.addEventListener("click", function () {
        getCharacter(i, query, params);
      });
      paginationContainer.appendChild(pageElem);
    }

    // Next Button
    if (currentPage < countPage) {
      const nextBtn = document.createElement("div");
      nextBtn.innerHTML = `<span class="pagination_NavBtn">Next</span>`;
      paginationContainer.appendChild(nextBtn);
      nextBtn.addEventListener("click", function () {
        currentPage += 1;
        getCharacter(currentPage, query, params);
      });
    }
  };
  renderPagination();
};

getCharacter(1);

async function searchCharacter(event) {
  event.preventDefault();
  const searchString = document.querySelector(".SearchBar__input").value;
  getCharacter(1, "&name=", searchString);
}
