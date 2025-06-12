// TASK 1 Task 1
function delayedPromise(value, delayMs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });
}

const promises = [
  delayedPromise("Value 1", 1500),
  delayedPromise("Value 2", 3000),
  delayedPromise("Value 3", 1000),
  delayedPromise("Value 4", 2500),
  delayedPromise("Value 5", 2000),
];

Promise.all(promises)
  .then((results) => {
    console.log("Результати виконання всіх промісів:");
    results.forEach((result, index) => {
      console.log(`[${index + 1}] ${result}`);
    });
  })
  .catch((error) => {
    console.error("Помилка при виконанні Promise.all:", error);
  });

// TASK 1 Task 2
function randomDelay(value) {
  const delay = Math.floor(Math.random() * 4000) + 1000; //
  return new Promise((resolve) => {
    setTimeout(() => resolve({ value, delay }), delay);
  });
}

const racePromises = [
  randomDelay("Результат 1"),
  randomDelay("Результат 2"),
  randomDelay("Результат 3"),
  randomDelay("Результат 4"),
  randomDelay("Результат 5"),
];

Promise.race(racePromises)
  .then(({ value, delay }) => {
    console.log("Найшвидший проміс:");
    console.log(`Значення: ${value}`);
    console.log(`Час виконання: ${delay} мс`);
  })
  .catch((error) => {
    console.error("Помилка при виконанні Promise.race:", error);
  });

// TASK 1 COUNTRY SEARCH

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
      .map(
        (cat) =>
          `<img src="${cat.url}" alt="Cat" loading="lazy" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />`
      )
      .join("");
    catResults.insertAdjacentHTML("beforeend", markup);
    catPage++;
  } catch {
    alert("Error loading cats");
  }
}

catLoadMore.addEventListener("click", loadCats);
loadCats();

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
