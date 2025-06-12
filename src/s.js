// TASK 1 - COUNTRY SEARCH

const countryInput = document.getElementById("countryInput");
const results = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");

function renderCountryList(countries) {
  results.innerHTML = countries
    .map((c) => `<li>${c.name.common}</li>`)
    .join("");
}

function renderCountryDetails(country) {
  const languages = Object.values(country.languages || {}).join(", ");
  results.innerHTML = `
    <li>
      <h2>${country.name.common}</h2>
      <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
      <p>Population: ${country.population.toLocaleString()}</p>
      <p>Languages: ${languages}</p>
      <img src="${country.flags.svg}" alt="Flag of ${
    country.name.common
  }" width="150" />
    </li>`;
}

function notify(message) {
  alert(message);
}

async function fetchCountries() {
  const query = countryInput.value.trim();
  if (!query) {
    results.innerHTML = "";
    return;
  }
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    if (!res.ok) throw new Error("Countries not found");
    const data = await res.json();

    if (data.length > 10) {
      results.innerHTML = "";
      notify("Too many results. Please enter a more specific query.");
    } else if (data.length > 1) {
      renderCountryList(data);
    } else if (data.length === 1) {
      renderCountryDetails(data[0]);
    }
  } catch (e) {
    results.innerHTML = "";
    notify("Countries not found or server error.");
  }
}

searchBtn.addEventListener("click", fetchCountries);

// TASK 2 - CATS

const catResults = document.getElementById("catResults");
const catLoadMore = document.getElementById("catLoadMore");

let catPage = 1;
const catLimit = 4;
const catApiKey =
  "live_MbqbGmV1SsALeirOBY5Mt36UjMlvxDqG1RtzxSk0DAmOMH9zS7A8ehMiZBHNstnA";

async function loadCats() {
  try {
    const res = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${catLimit}&page=${catPage}&order=Desc&category_ids=1`,
      {
        headers: { "x-api-key": catApiKey },
      }
    );
    const data = await res.json();
    if (data.length === 0) {
      catLoadMore.disabled = true;
      return;
    }
    const markup = data
      .map((cat) => `<img src="${cat.url}" alt="Cat" loading="lazy" />`)
      .join("");
    catResults.insertAdjacentHTML("beforeend", markup);
    catPage++;
  } catch {
    alert("Error loading cats");
  }
}

catLoadMore.addEventListener("click", loadCats);
loadCats(); // initial load

// TASK 3 - POSTS

const ghUsers = document.querySelector(".githubUsers");
const seePostBtn = document.querySelector(".seePost");
let postLimit = 5;

function makePostsMarkup(posts) {
  return posts
    .map((p) => `<li><h3>${p.title}</h3><p>${p.body}</p></li>`)
    .join("");
}

seePostBtn.addEventListener("click", async () => {
  postLimit += 5;
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${postLimit}`
    );
    const data = await res.json();
    ghUsers.innerHTML = makePostsMarkup(data);
  } catch {
    alert("Error loading posts");
  }
});

(async () => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=5`
  );
  const data = await res.json();
  ghUsers.innerHTML = makePostsMarkup(data);
})();
