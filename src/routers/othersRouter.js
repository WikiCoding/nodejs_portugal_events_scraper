const express = require("express");
const router = new express.Router();

router.get("/api/v1/events/others", async (req, res) => {
  let location;
  let date;
  let page;

  req.query.location == undefined ? location = "porto" : location = req.query.location;
  req.query.date == undefined ? date = formatDate(new Date(Date.now())) : date = formatDate(new Date(req.query.date));
  req.query.page == undefined ? page = 0 : page = parseInt(req.query.page - 1);

  let foundEvents = [];

  const name = "";
  const eventHour = "Check website: ";

  const dataUrls = [
    "https://teatrosadabandeira.pt/agenda/",
    "https://www.coliseu.pt/agenda",
    "https://www.superbockarena.pt/agenda/",
    "https://www.maushabitos.com/espetaculos-e-clubbing/",
    "https://casadamusica.com/agenda/",
  ];

  dataUrls.forEach(el => {
    const name = el;
    const evnt = { url: el, name, location, date, eventHour };

    foundEvents = [...foundEvents, evnt];
  });

  const requestUrl = "";

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