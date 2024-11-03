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

const baseUrl = "http://localhost:3000";
const apiVersion = "api/v1";
const endpoint = "events";

const portugalDistricts = ["porto", "lisboa", "coimbra", "acores", "aveiro", "beja", "braga", "braganca", "castelo-branco", "evora", "faro", "guarda", "leiria", "madeira", "portalegre", "santarem", "setubal", "viana-do-castelo", "vila-real", "viseu"];

const loc = document.getElementById("location");
const selectedDate = document.getElementById("calendar");
const searchBtn = document.getElementById("search-btn");
const container = document.getElementById("items");
const nextBtn = document.getElementById("next-btn");

let currentLocation = "porto";
let page = 1;

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

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  await makeApiRequest(page);
});

nextBtn.addEventListener("click", async () => {
  page = page + 1;
  await makeApiRequest(page);
})

const makeApiRequest = async (page) => {
  try {
    const req = await fetch(`${baseUrl}/${apiVersion}/${endpoint}?location=${currentLocation}&date=${selectedDate.value}&page=${page}`);

    container.innerHTML = "";

    const { currentPage, date, events, location, numberElements, requestUrl } = await req.json();

    // DUMMY DATA FOR DEV
    // const numberElements = 20
    // const events = dummyData;
    // const location = "porto";
    // const date = "2024-11-02";
    // DUMMY DATA FOR DEV

    const eventHeader = document.createElement("h3");
    eventHeader.innerHTML = `Seeing page ${currentPage} of events from ${location} on ${date}`

    container.appendChild(eventHeader)

    renderItems(events);

    if (numberElements === 20) {
      nextBtn.removeAttribute("disabled");
    } else {
      nextBtn.setAttribute("disabled", "");
    }
  } catch (ex) {
    alert(ex);
  }
}

const renderItems = (events) => {
  events.forEach(el => {
    const div = document.createElement("div");
    const linkEvent = document.createElement("a");
    const locationDiv = document.createElement("div");
    const eventLocation = document.createElement("a");

    div.classList.add("container");
    div.classList.add("card");

    linkEvent.innerHTML = el.name;
    linkEvent.href = el.url;
    eventLocation.innerHTML = el.location;

    locationDiv.appendChild(eventLocation);
    div.appendChild(linkEvent);
    div.appendChild(locationDiv);

    container.appendChild(div);
  });
};