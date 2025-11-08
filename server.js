// server.js — entry, зөвхөн wiring хийнэ

const express = require("express");
const session = require("express-session");
const { PORT, SESSION_SECRET } = require("./config");
const { registerPublicRoutes } = require("./routes_public");
const { registerAdminRoutes } = require("./routes_admin");
const { registerApiRoutes } = require("./routes_api");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);

// Routes
registerPublicRoutes(app);
registerAdminRoutes(app);
registerApiRoutes(app);

// Start
app.listen(PORT, () => {
  console.log(`NFC Leaderboard listening on http://127.0.0.1:${PORT}`);
});
