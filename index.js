const express = require("express");
const app = express();
const baseUrl = "https://www.viralagenda.com" // each element is a page, default number of elements loaded is 20
const cors = require("cors");
const path = require('path');
const clientPath = path.join(__dirname, './client');

const corsOptions = {
  origin: true,
}

app.use(cors(corsOptions));
app.use(express.static(clientPath));

app.get("/", (req, res) => {
  res.sendFile(`${clientPath}/index.html`)
});

app.get("/api/v1/events", async (req, res) => {
  if (isNaN(Date.parse(req.query.date))) {
    return res.status(400).send({ message: "Couldn't parse date" });
  }

  let location;
  let date;
  let page;

  req.query.location == undefined ? location = "porto" : location = req.query.location;
  req.query.date == undefined ? date = formatDate(new Date(Date.now())) : date = formatDate(new Date(req.query.date));
  req.query.page == undefined ? page = 0 : page = parseInt(req.query.page - 1);

  if (page < 0) return res.status(400).send({ message: "Negative pages are not handled" });

  const requestUrl = `${baseUrl}/pt/${location}/${date}?page=${page * 20}`;

  console.log("Making HTTP request to", requestUrl);

  const response = await fetch(requestUrl);

  const data = await response.text();

  console.log("Received response with status", response.status);

  const regex = /<meta\s+itemprop="description"\s+content="([^"]*)"\s*\/?>/g;
  const resultingData = data.match(regex).map(el => el.split('<meta itemprop="description" content="')[1].split('">')[0]);

  const dataUrls = [...data.matchAll(/data-url="([^"]*)"/g)].map(match => "https://www.viralagenda.com" + match[1]);

  let foundEvents = [];

  for (i = 0; i < resultingData.length; i++) {
    const name = resultingData[i].split(" | ")[0].split(" @ ")[0];
    const location = resultingData[i].split(" @ ")[1].split(" | ")[0];
    const eventDate = new Date(Date.parse(resultingData[i].split(" | ")[1]));

    const evnt = { url: dataUrls[i], name, location, date: eventDate }

    if (eventDate.toString() === new Date(Date.parse(date)).toString()) foundEvents = [...foundEvents, evnt]
  }

  const events = foundEvents.filter(event => new Date(event.date).getTime() !== new Date(Date.parse(date)));

  const apiData = {
    location,
    requestUrl,
    date,
    currentPage: page,
    numberElements: foundEvents.length,
    events
  };

  return res.status(200).send(apiData)
});

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
})