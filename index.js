const server = require("./api/server");

const port = process.env.PORT || 6660;

server.listen(port, () => {
  console.log(`\n* Server running on Port:${port} *\n`);
});
