const dummyData = [
  {
    "url": "https://www.viralagenda.com/pt/events/1540425/a-e-i-o-u-um-breve-alfabeto-do-amor-de-nicolette-krebitz",
    "name": "A E I O U: UM BREVE ALFABETO DO AMOR  de Nicolette Krebitz",
    "location": "Casa das Artes (Porto)",
    "date": "2024-02-11T00:00:00.000Z"
  },
  {
    "url": "https://www.viralagenda.com/pt/events/1509594/trofeu-karting-2024",
    "name": "Troféu Karting 2024",
    "location": "Perafita",
    "date": "2024-02-11T00:00:00.000Z"
  }
]

// const baseUrl = "http://localhost:3000";
const baseUrl = "https://portugal-events.onrender.com";
const apiVersion = "api/v1/events";
let endpoint = "viral-agenda";

const portugalDistricts = ["porto", "lisboa", "coimbra", "acores", "aveiro", "beja", "braga", "braganca", "castelo-branco", "evora", "faro", "guarda", "leiria", "madeira", "portalegre", "santarem", "setubal", "viana-do-castelo", "vila-real", "viseu"];

const loc = document.getElementById("location");
const provider = document.getElementById("provider");
const selectedDate = document.getElementById("calendar");
const searchBtn = document.getElementById("search-btn");
const container = document.getElementById("items");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

let currentLocation = "porto";
let page = 1;
let currentProvider = "viral-agenda";

document.addEventListener("DOMContentLoaded", () => {
  portugalDistricts.forEach(el => {
    const option = document.createElement("option");
    option.value = el;
    option.innerHTML = el.charAt(0).toUpperCase() + el.slice(1);

    loc.appendChild(option);
  });
});

loc.addEventListener("change", () => {
  currentLocation = loc.value;
});

provider.addEventListener("change", () => {
  currentProvider = provider.value;

  currentProvider === "agenda-cultural-porto" || currentProvider === "others" ? selectedDate.setAttribute("disabled", "") : selectedDate.removeAttribute("disabled");
  currentProvider === "agenda-cultural-porto" || currentProvider === "others" ? loc.setAttribute("disabled", "") : loc.removeAttribute("disabled");

  endpoint = currentProvider;
});

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  await handleApiRequestClick(page);
});

nextBtn.addEventListener("click", async () => {
  page = page + 1;

  await handleApiRequestClick(page);
});

prevBtn.addEventListener("click", async () => {
  if (page > 1) {
    page = page - 1;
    await handleApiRequestClick(page);
  }
});

const handleApiRequestClick = async (page) => {
  searchBtn.setAttribute("disabled", "");
  searchBtn.innerHTML = "Loading...";
  await makeApiRequest(page);
  currentProvider === "agenda-cultural-porto" || currentProvider === "others" ? nextBtn.setAttribute("disabled", "") : nextBtn.removeAttribute("disabled");
  currentProvider === "viral-agenda" && page > 1 ? prevBtn.removeAttribute("disabled") : prevBtn.setAttribute("disabled", "");
  searchBtn.removeAttribute("disabled", "");
  searchBtn.innerHTML = "Search";
}

const makeApiRequest = async (page) => {
  try {
    const viralRequestUrl = `${baseUrl}/${apiVersion}/${endpoint}?location=${currentLocation}&date=${selectedDate.value}&page=${page}`;
    const genericRequestUrl = `${baseUrl}/${apiVersion}/${endpoint}`;

    let req;

    if (currentProvider === "viral-agenda") req = await fetch(viralRequestUrl);
    if (currentProvider === "agenda-cultural-porto" || currentProvider === "others") req = await fetch(genericRequestUrl);

    container.innerHTML = "";

    const { currentPage, date, events, location, numberElements, requestUrl } = await req.json();

    // DUMMY DATA FOR DEV
    // const numberElements = 20
    // const events = dummyData;
    // const location = "porto";
    // const date = "2024-11-02";
    // DUMMY DATA FOR DEV

    const eventHeader = document.createElement("h3");
    eventHeader.innerHTML = `Seeing page ${currentPage + 1} of events from ${location} on ${date}`

    container.appendChild(eventHeader);

    if (page === 1) prevBtn.setAttribute("disabled", "");

    renderItems(events);
  } catch (ex) {
    alert(ex);
  }
}

const renderItems = (events) => {
  if (events.length === 0) {
    const div = document.createElement("div");

    div.innerHTML = "No events loaded on this page."

    container.appendChild(div);
  } else {
    events.forEach(el => {
      const div = document.createElement("div");
      const linkEvent = document.createElement("a");
      const locationDiv = document.createElement("div");
      const eventLocation = document.createElement("a");
      const eventHour = document.createElement("div");

      div.classList.add("container");
      div.classList.add("card");

      linkEvent.innerHTML = el.name;
      linkEvent.href = el.url;
      eventLocation.innerHTML = el.location;
      eventHour.innerHTML = el.eventHour;

      locationDiv.appendChild(eventLocation);
      div.appendChild(eventHour);
      div.appendChild(linkEvent);
      div.appendChild(locationDiv);

      container.appendChild(div);
    });
  }
};