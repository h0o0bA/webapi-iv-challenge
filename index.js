// code away!
const server = require("./server");

const port = 8000;

server.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
