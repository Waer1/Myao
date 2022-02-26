const app = require("./app");
const connection = require("./connection");
const dotenv = require("./dot.env");

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

////////////////////////////////////////////////

app.get(".", (req, res) => {});
