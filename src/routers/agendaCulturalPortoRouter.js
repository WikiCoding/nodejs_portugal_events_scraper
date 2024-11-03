const express = require("express");
const router = new express.Router();

router.get("/api/v1/events-porto", async (req, res) => {
  const requestUrl = "https://agendaculturalporto.org/eventos-hoje-no-norte/";

  let date;
  let page;

  req.query.date == undefined ? date = formatDate(new Date(Date.now())) : date = formatDate(new Date(req.query.date));
  req.query.page == undefined ? page = 0 : page = parseInt(req.query.page - 1);

  if (page < 0) return res.status(400).send({ message: "Negative pages are not handled" });

  const response = await fetch(requestUrl);

  const data = await response.text();

  const regex = /<a\s+class="mec-color-hover"\s+data-event-id="([^"]+)"\s+href="([^"]+)"\s+target="_blank"\s+rel="noopener">([^<]+)<\/a>/g;
  const locationRegex = /<p\s+class="mec-grid-event-location">([^"]+)<\/p>/g;

  const elements = data.match(regex);
  const locationElements = data.match(locationRegex)

  let foundEvents = [];

  const eventHour = "Check Website for hours";
  const location = "Porto"

  elements.forEach((el, i) => {
    const url = el.split('href="')[1].split('" target="')[0];
    const name = el.split('rel="noopener">')[1].split("</a>")[0];
    const location = locationElements[i].split('class="mec-grid-event-location">')[1].split('</p>')[0];

    const evnt = { url, name, location, date, eventHour }

    foundEvents = [...foundEvents, evnt]
  });

  const apiData = {
    location,
    requestUrl,
    date,
    currentPage: page,
    numberElements: foundEvents.length,
    events: foundEvents
  };

  return res.status(200).send(apiData)
});

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

module.exports = router;