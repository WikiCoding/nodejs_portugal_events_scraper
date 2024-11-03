const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const clientPath = path.join(__dirname, '../client');
const viralAgendaRouter = require("./routers/viralAgendaRouter");
const agendaCulturalPortoRouter = require("./routers/agendaCulturalPortoRouter");

const corsOptions = {
  origin: true,
}

app.use(cors(corsOptions));
app.use(express.static(clientPath));
app.use(viralAgendaRouter);
app.use(agendaCulturalPortoRouter);

app.get("/", (req, res) => {
  res.sendFile(`${clientPath}/index.html`)
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
})