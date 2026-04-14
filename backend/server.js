const express = require("express");
const cors = require("cors");

const spotify = require("./spotify");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/login", spotify.login);
app.get("/callback", spotify.callback);

app.listen(5000, () => {
console.log("Server running on 5000");
});